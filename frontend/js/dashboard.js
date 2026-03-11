const addbtn = document.getElementById("add-btn");
addbtn.addEventListener("click", () => {
  window.location.href = "/formulaire";
});

let currentEditId = null;

const openModal = (id, name) => {
  currentEditId = id;
  document.getElementById('modalName').value = name;
  document.getElementById('modal-overlay').style.display = 'flex';
};

const closeModal = () => {
  currentEditId = null;
  document.getElementById('modal-overlay').style.display = 'none';
};


const displayTask = (tasks) => {
  const todo = document.getElementById("to-do");
  const inprogress = document.getElementById("in-progress");
  const finish = document.getElementById("finish");

  [todo, inprogress, finish].forEach(
    (col) => (col.nextElementSibling.innerHTML = ""),
  );

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";

    // texte + boutons
    div.innerHTML = `
      <p>${task.name}</p>
      <div class="btn_action">
      <button  class="go-back-btn"onClick="goBackTask(${task.id},${task.status})"><--</button>
      <button onclick="openModal(${task.id}, '${task.name}')">modifier</button>
      <button onclick="deleteTask(${task.id})">Supprimer</button>
      <button class="update-btn" onclick="updateTask(${task.id},${task.status})">--></button>
        
      </div>
    `;

    switch (task.status) {
      case 0:
        todo.nextElementSibling.appendChild(div);
        div.querySelector(".go-back-btn").style.display = "none";

        break;
      case 1:
        inprogress.nextElementSibling.appendChild(div);
        break;
      case 2:
        finish.nextElementSibling.appendChild(div);
        div.querySelector(".update-btn").style.display = "none";
        break;
    }
  });
};
const getTask = async () => {
  try {
    const userID = localStorage.getItem("userID");
    console.log(userID);
    const response = await fetch(
      `http://localhost:5000/api/tasks/tasks/${userID}`,
      {},
    );

    const task = await response.json();
    displayTask(task);
  } catch (error) {
    console.error(error);
  }
};
const updateTask = async (id, CurrentStatus) => {
  let newStatus;
  if (CurrentStatus === 0) newStatus = 1;
  else if (CurrentStatus === 1) newStatus = 2;
  else return;
  console.log(id, newStatus);
  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/puttasks/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour");
    }

    const task = await response.json();
    console.log("Statut mis à jour", task);
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

const goBackTask = async (id, CurrentStatus) => {
  let newStatus;
  if (CurrentStatus === 2) newStatus = 1;
  else if (CurrentStatus === 1) newStatus = 0;
  else return;
  console.log(id, newStatus);
  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/puttasks/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour");
    }

    const task = await response.json();
    console.log("Statut mis à jour", task);
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

const saveEdit = async () => {
  const newName = document.getElementById('modalName').value;

  if (!newName.trim()) {
    alert("Le nom ne peut pas être vide");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/tasks/puttaskname/${currentEditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newName })
    });

    if (!response.ok) throw new Error('Erreur modification');

    closeModal();
    await getTask();

  } catch (error) {
    console.error(error);
  }
};

const deleteTask = async (id) => {
  try {
    console.log(id);
    const response = await fetch(
      `http://localhost:5000/api/tasks/deletetasks/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      },
    );
    const task = await response.json();
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

getTask();
