const createTask = async () => {
  try {
    const name = document.getElementById("title").value.trim();
    if (name === "") {
      return alert("Veuillez entrer un nom pour la tâche.");
    }
    const userID = localStorage.getItem("userID");
    console.log(userID);
    const response = await fetch(`http://localhost:5000/api/tasks/addtasks/${userID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    });

    const task = await response.json();
    window.location.href = "/dashboard";
  } catch (error) {
    console.error(error);
  }
};

const backdash = document.getElementById("back-btn");
backdash.addEventListener('click', () => {
  window.location.href = "/dashboard";
});

const submitBtn = document.getElementById("submit-task");
submitBtn.addEventListener('click', createTask);
