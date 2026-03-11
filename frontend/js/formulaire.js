const createTask = async () => {
  try {
    const name = document.getElementById("title").value.trim();
    if (name === "") {
      return alert("Veuillez entrer un nom pour la tâche.");
    }
    const response = await fetch("/api/tasks/addtasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      alert(data.message || "Erreur lors de la création de la tâche.");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur serveur.");
  }
};

const backdash = document.getElementById("back-btn");
backdash.addEventListener("click", () => {
  window.location.href = "/dashboard";
});

const submitBtn = document.getElementById("submit-task");
submitBtn.addEventListener("click", createTask);
