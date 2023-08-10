// let token = récupération de cette clé :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
//eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.
//JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"pour obtenir 
//l'autorisation dans swagger et stocker le token

let token = localStorage.getItem("token"); // permet un acces constant des donnée API

// FILTRE DE LA GALERIE:

const boutons = document.querySelectorAll('.buttons button');//je selectionne tous les boutons
let imgs = []

// -------------------------------------------------------------------------------------
function fetchAndPopulateCategorie() {
  fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(categories => {
          const categoryButtons = document.getElementById('categoryButtons'); // Assure-toi d'avoir l'ID correct ici

          categories.forEach(category => {
              const button = document.createElement('button');
              button.type = 'button';
              button.textContent = category.name;

              // Vérifier si le bouton avec la même catégorie existe déjà
              const existingButton = categoryButtons.querySelector(`button[data-btn="${category.id}"]`);
              if (!existingButton) {
                  // Ajout de l'attribut data-btn avec la valeur de la catégorie
                  button.setAttribute('data-btn', category.id);

                  categoryButtons.appendChild(button);
              }
          });

          // Ajouter un écouteur d'événement pour les boutons de filtre
          const buttons = categoryButtons.querySelectorAll('button');
          buttons.forEach(button => {
              button.addEventListener('click', handleFilterButtonClick);
          });
      })
      .catch(error => {
          console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
      });
}

// Fonction pour gérer le clic sur les boutons de filtre
function handleFilterButtonClick(event) {
  const clickedButton = event.target;

  // Ajouter la classe "btn-clicked" au bouton cliqué
  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach(button => {
      button.classList.remove('btn-clicked');
  });
  clickedButton.classList.add('btn-clicked');

  // Appeler la fonction de filtrage des photos
  filtrerPhotos(event);
}

// Appeler la fonction pour récupérer et afficher les catégories
fetchAndPopulateCategorie();


// Fonction pour gérer le clic sur les boutons de filtre
function handleFilterButtonClick(event) {
    const clickedButton = event.target;

    // Ajouter la classe "btn-clicked" au bouton cliqué
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
        button.classList.remove('btn-clicked');
    });
    clickedButton.classList.add('btn-clicked');

    // Appeler la fonction de filtrage des photos
    filtrerPhotos(event);
}

// Appeler la fonction pour récupérer et afficher les catégories
fetchAndPopulateCategorie();

// Met la classe sur le bouton selectionné par le click (car il est callback dans filter img)
function affichageBoutonClique(e) {
  boutons.forEach(btn => {
    btn.classList.remove('btn-clicked');
  });
  e.target.classList.add('btn-clicked');
}

function filtrerPhotos(e) {
  affichageBoutonClique(e);
  imgs.forEach(img => {
    // Va dans toute les images et les remet par défaut en expand
    img.classList.remove('img-shrink');
    img.classList.add('img-expand')

    //   va chercher les données des images et des boutons 
    const imgType = parseInt(img.dataset.img);
    const btnType = parseInt(e.target.dataset.btn);

    //   si la donnée du bouton ne correspond pas la donnée image, applique la classe shrink
    if (imgType !== btnType) {
      img.classList.remove('img-expand');
      img.classList.add('img-shrink');
    }
  });
}

// Le premier bouton ramene toutes les images en grand et se met en surbrillance
function toutes() {
  boutons[0].addEventListener('click', (e) => {
    affichageBoutonClique(e)
    imgs.forEach(img => {
      img.classList.remove('img-shrink');
      img.classList.add('img-expanded');
    });
  });
}
// selectionne l'ensemble des boutons et active celui qui est cliqué avec la fonction "filtrerPhotos"
function activerFiltre() {
  for (let i = 1; i < boutons.length; i++) {
    boutons[i].addEventListener('click', filtrerPhotos);
  }
}

// -----------------------------------------------------------------------------------------------

// ------- Affiche les photos dans la gallerie ------------------------------

function afficherPhoto() {
  fetch('http://localhost:5678/api/works') //appel de l'API pour récupérer les travaux
    .then(res => res.json())
    .then(data => {
      document.querySelector('.gallery').innerHTML = '';

      data.forEach(element => {
        photoGallery(element)
      });
      data.forEach(element => {
        photoModal(element)
      })
      imgs = document.querySelectorAll('.gallery figure');
      activerFiltre()
      toutes()
      document.querySelectorAll('.trash').forEach(element => {
        element.addEventListener('click', deleteImg);
      });
    })
}
afficherPhoto()

let counter = 0;
// Crée les éléments figure etc pour chaque photo 
function photoGallery(element) {
  counter++
  const figure = document.createElement("figure");
  figure.setAttribute("data-img", `${element.categoryId}`);
  figure.setAttribute("data-id", `${counter}`);
  figure.setAttribute('id', `figure-${element.id}`)
  let newFigure = document.querySelector(".gallery").appendChild(figure);
  newFigure.innerHTML = `<img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous" ">
    <figcaption>${element.title}</figcaption>`;
}

//

function photoModal(element) {
  let figure = document.createElement("figure");
  figure.setAttribute('id', `figure-${element.id}`);
  figure.classList.add("modal__figure");
  figure.innerHTML = `
    <i class="direction fa-solid fa-arrows-up-down-left-right" style="display: none;"></i>
    <i class="trash fa-solid fa-trash-can" id="${element.id}"></i>
    <i class="move fa-solid fa-arrows-alt" id="${element.id}"></i> <!-- Nouveau bouton pour déplacer -->
    <img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous">
    <figcaption>éditer</figcaption>
  `;

  const gallery = document.querySelector(".modal__gallery");
  gallery.appendChild(figure);
}

// ------------------------------------------------------------------------------------------

// APPARITION / DISPARITION DES MODALS


// fonction ouvrir et fermer qui vont attribuer des propriété aux modales lorsqu'elles sont ouvertes ou fermées
function ouvrirModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.style.display = null;
  modal.setAttribute('aria-modal', 'true');
  eventPropagation(modal);
}

function fermerModal() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
    modal.setAttribute('aria-modal', 'false');
  });
  document.getElementById('photo-submit').reset();
  chosenImage.setAttribute('src', '');
  titleValue = null;
  btnValue = null;
  imageSelected = null;
  document.querySelector('.label-file').removeAttribute("style");
}


//permet de fermer la modal lorsqu'on clic à l'extérieur en utilisant la methode stop propagation
function eventPropagation(modal) {
  modal
    .querySelector('.js-modal-stop')
    .addEventListener('click', stopPropagation);
  modal.addEventListener('click', fermerModal);
}

function stopPropagation(event) {
  event.stopPropagation();
}

document.querySelector('.js-modal').addEventListener('click', function (event) {
  event.preventDefault();
  ouvrirModal('.modal');
});

//au clic sur le bouton "ajouter une photo" qui a la class (.js-modal-form), 
//fermeture de la première modal et ouverture de la deuxième
document.querySelector('.js-modal-Form').addEventListener('click', function (event) {
  event.preventDefault();
  fermerModal();
  ouvrirModal('#modal-Form');
});

//fermeture des modals avec le clic sur la croix
const closeModalButtons = document.querySelectorAll('.js-close-modal');
closeModalButtons.forEach(button => {  //itère sur chaque croix avec la méthode forEach
  button.addEventListener('click', function (event) {
    event.preventDefault();
    fermerModal();
  });
});

//icone retour qui ferme la 2eme modal et ouvre la 1ere
document.querySelector('.backward').addEventListener('click', function (event) {
  event.preventDefault();
  fermerModal();
  ouvrirModal('.modal');
});


document.querySelector('.js-modal-stop').addEventListener('click', function (event) {
  if (event.target === this) {
    fermerModal();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.keyCode === 27) { //ferme les modales si la touche esc est enfoncée
    fermerModal();
  }
});

// ---------------------------------------------------------------------------------------------------

// SUPPRESSION DES IMAGES

let galleryModal = document.querySelector('.modal__gallery');
let gallery = document.querySelector('.gallery');

function deleteImg(e) {  //réponse à l'écouteur d'évènement créé dans la fonction afficherPhoto
  let id = e.target.id;
  let figureModal = galleryModal.querySelector(`#figure-${id}`);
  console.log(figureModal)
  figureModal.remove()
  let figure = gallery.querySelector(`#figure-${id}`);
  console.log(figure)
  figure.remove()

  fetch("http://localhost:5678/api/works/" + id, { //autorisation pour la suppression des images
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })

    .then(data => {
      afficherPhoto()
    })
    .catch((err) => { })
}

// AJOUT DES IMAGES
// Fonction pour récupérer et afficher les catégories dans le menu déroulant
function fetchAndPopulateCategories() {
  fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(categories => {
          const categorySelect = document.getElementById('category');

          categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.id;
              option.textContent = category.name;

              // Ajout de l'attribut data-btn avec la valeur de la catégorie
              option.setAttribute('data-btn', category.id);

              categorySelect.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
      });
}


// Appelle la fonction pour récupérer et afficher les catégories
fetchAndPopulateCategories();

let photoForm = document.getElementById('photo-submit');
const submitButton = photoForm.querySelector('input[type^="sub"]');
let btnValue = null;
let titleValue = null;
document.getElementById('category').addEventListener('change', (e) => {
  titleValue = document.getElementById('name').value;
  btnValue = e.target.options[e.target.selectedIndex].getAttribute('data-btn');
})

let uploadButton = document.getElementById('upload-button');
let chosenImage = document.getElementById('chosen-image');
let fileName = document.getElementById('file-name');

let imageSelected = null;

uploadButton.onchange = () => {  // Lorsque le bouton de sélection de fichier est modifié
  let reader = new FileReader();   // Création  d'un nouvel objet FileReader
  reader.readAsDataURL(uploadButton.files[0]);  // Lit le contenu du premier fichier sélectionné en tant qu'URL de données

  imageSelected = uploadButton.files[0]// Stocke le premier fichier sélectionné dans une variable imageSelected
  reader.onload = () => {   //Lorsque le contenu du fichier est chargé avec succès
    chosenImage.setAttribute('src', reader.result)  // Attribue l'URL de données du contenu du fichier à l'attribut src de l'élément chosenImage
  }
  let labelClass = document.querySelector('.label-file'); // Sélectionne l'élément ayant la classe CSS .label-file
  labelClass.style.display = 'none';  //
}

photoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!titleValue || !btnValue || !imageSelected) {
    document.querySelector('.error-message').innerHTML = "Vous devez remplir tous les champs du formulaire"
    // console.error("Vous devez remplir tous les champs du formulaire");
    return;
  } else {
    document.querySelector('.error-message').innerHTML = ""
  }

  let formData = new FormData();  //envoyer les nouvelles photos vers l'API
  formData.append("image", imageSelected)
  formData.append("title", titleValue)
  formData.append('category', btnValue)
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token
    },
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      afficherPhoto()
    })
    .catch((err) => { })
  fermerModal();
})

// -------------- LOGIN ET LOGOUT-----------

if (localStorage.getItem("token")) {
  document.querySelector('.login__btn').innerText = "logout"
  const modalOpener = document.querySelector(".modal__link");
  modalOpener.style.display = null;
  const editionMode = document.querySelector(".edition-mode__container");
  editionMode.style.display = null;
  let categoryButtons = document.querySelector('.buttons');
  categoryButtons.style.display = "none"
  if (document.querySelector('.login__btn').innerText === "logout") {
    document.querySelector('.login__btn').addEventListener('click', () => {
      localStorage.clear()
      window.location.href = "./pages/index.html"
    })
  }
}