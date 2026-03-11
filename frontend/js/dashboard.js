const addbtn = document.getElementById("add-btn");
addbtn.addEventListener("click", () => {
  window.location.href = "/formulaire";
});

let currentEditId = null;

const openModal = (id, name) => {
  currentEditId = id;
  document.getElementById("modalName").value = name;
  document.getElementById("modal-overlay").style.display = "flex";
};

const closeModal = () => {
  currentEditId = null;
  document.getElementById("modal-overlay").style.display = "none";
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

    div.innerHTML = `
            <p>${task.name}</p>
            <div class="btn_action">
                <button class="go-back-btn" onclick="goBackTask(${task.id}, ${task.status})"><--</button>
                <button onclick="openModal(${task.id}, '${task.name}')">modifier</button>
                <button onclick="deleteTask(${task.id})">Supprimer</button>
                <button class="update-btn" onclick="updateTask(${task.id}, ${task.status})">--></button>
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
    const response = await fetch("/api/tasks/tasks", {
      credentials: "include",
    });
    const task = await response.json();
    displayTask(task);
  } catch (error) {
    console.error(error);
  }
};

const updateTask = async (id, currentStatus) => {
  let newStatus;
  if (currentStatus === 0) newStatus = 1;
  else if (currentStatus === 1) newStatus = 2;
  else return;

  try {
    const response = await fetch(`/api/tasks/puttasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour");
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

const goBackTask = async (id, currentStatus) => {
  let newStatus;
  if (currentStatus === 2) newStatus = 1;
  else if (currentStatus === 1) newStatus = 0;
  else return;

  try {
    const response = await fetch(`/api/tasks/puttasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour");
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

const saveEdit = async () => {
  const newName = document.getElementById("modalName").value;
  if (!newName.trim()) {
    alert("Le nom ne peut pas être vide");
    return;
  }
  try {
    const response = await fetch(`/api/tasks/puttaskname/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newName }),
    });
    if (!response.ok) throw new Error("Erreur modification");
    closeModal();
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

const deleteTask = async (id) => {
  try {
    const response = await fetch(`/api/tasks/deletetasks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erreur suppression");
    await getTask();
  } catch (error) {
    console.error(error);
  }
};

getTask();
