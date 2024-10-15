import { initialCards } from "./cards.js";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(cardData, deleteCardCallback) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  cardTitle.textContent = cardData.name;

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardData.link;
  // cardImage.setAttribute("src", cardData.link); // another way

  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", (event) => {
    const cardToDelete = event.target.closest(".card");
    deleteCardCallback(cardToDelete);
  });

  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard);
  placesList.appendChild(cardElement);
});

/* another way 
for (const cardData of initialCards) {
  const cardElement = createCard(cardData, deleteCard);
  placesList.appendChild(cardElement);
}
*/
