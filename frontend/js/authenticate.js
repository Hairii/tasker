const loginFormBox = document.getElementById("loginFormBox");
const registerFormBox = document.getElementById("registerFormBox");

const showLoginForm = document.getElementById("showLoginForm");
const showRegisterForm = document.getElementById("showRegisterForm");

showLoginForm.addEventListener('click', () =>{
    registerFormBox.style.display = "none";
    loginFormBox.style.display ="block";
});


showRegisterForm.addEventListener('click', () => {
    loginFormBox.style.display = 'none';
    registerFormBox.style.display = 'block';
});

console.log(loginFormBox);

//register
registerFormBox.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    try{
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: email, password })
        });
        
        const data = await response.json();
        
        if(response.ok){
            alert(data.message || 'Compte crée');
            registerFormBox.style.display = 'none';
            loginFormBox.style.display = 'block';
        }else{

         alert(data.message || "Erreur lors de la création du compte.");
        }
    } catch (error) {
        console.error(error);
        alert("Erreur serveur, impossible de créer le compte.");
    }
});



//login
loginFormBox.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email, password }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.token) {
            localStorage.setItem("userID", data.id);
            window.location.href = "/dashboard"; 
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error(error);
        alert("Erreur serveur !");
    });
});
