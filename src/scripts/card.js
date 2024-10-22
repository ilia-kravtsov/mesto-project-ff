import { showImagePopup } from '../index.js';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard(
  cardData,
  deleteCardCallback = deleteCard,
  likeCardCallback = likeCard,
  showImagePopupCallback = showImagePopup,
) {

  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector('.card__title');
  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');

  cardTitle.textContent = cardData.name;
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardImage.addEventListener('click', showImagePopupCallback);

  cardDeleteButton.addEventListener('click', (event) => {
    const cardToDelete = event.target.closest('.card');
    deleteCardCallback(cardToDelete);
  });

  likeButton.addEventListener('click', () => {
    likeCardCallback(likeButton);
  });

  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}


