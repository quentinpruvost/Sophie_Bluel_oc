const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error");
const valid = document.getElementById("login-form-submit");
const form = document.getElementById("login-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  //recupere les inputs
  const information = new FormData(form);
  const payload = new URLSearchParams(information);


  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      accept: "application/json",
    },

    body: payload,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.userId == 1) {
        localStorage.setItem("token", data.token);
        location.href = "../index.html";
      }
      else {
        error.innerText = " Identifiant / mot de passe incorrect";
        document.getElementById("email").value = null;
        document.getElementById("password").value = null;

  function msgdelet(){
    
    error.innerText=""
  }
  setTimeout(msgdelet ,20000); 
 

      }
    })

    .catch((err) => console.log(err));
  });
