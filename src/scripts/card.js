import { changeLikeStatus } from './api';

const cardTemplate = document.querySelector('#card-template').content;

let currentCardId, currentDeleteButton;

function likeCard(likeButton, likeCounter, cardId) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  if (cardId) {
    changeLikeStatus(cardId, isLiked)
      .then((cardData) => {
        if (cardData) {
          likeButton.classList.toggle('card__like-button_is-active');
          likeCounter.textContent = cardData.likes.length;
        }
      })
      .catch(console.error);
  }
}

export function createCard({
  cardData,
  showImagePopup,
  profileId,
  openDeleteConfirmationPopup,
  likeCardCallback = likeCard,
}) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector('.card__title');
  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-count');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');

  const cardId = cardData._id;
  likeCounter.textContent = cardData.likes.length;
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardImage.addEventListener('click', showImagePopup);
  const isLiked = cardData.likes.some((like) => like._id === profileId);

  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    likeCardCallback(likeButton, likeCounter, cardId);
  });

  if (cardData.owner._id !== profileId) {
    cardDeleteButton.classList.add('card__delete-button-unactive');
  } else {
    cardDeleteButton.addEventListener('click', () => {
      currentCardId = cardId;
      currentDeleteButton = cardDeleteButton;
      openDeleteConfirmationPopup();
    });
  }

  return cardElement;
}

export function getCurrentCard() {
  return { cardId: currentCardId, deleteButton: currentDeleteButton };
}