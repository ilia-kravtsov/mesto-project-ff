import './pages/index.css';
import { createCard, deleteCard } from './scripts/card.js';
import { openModal, closeModal } from './scripts/modal.js';
import { initialCards } from './scripts/cards.js';

const editPopup = document.querySelector('.popup_type_edit');
const editPopupCloseButton = editPopup.querySelector('.popup__close');

const profileEditForm = document.querySelector('form[name="edit-profile"]');
const profileNameInput = profileEditForm.querySelector('.popup__input_type_name');
const profilePositionInput = profileEditForm.querySelector('.popup__input_type_description');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const addCardButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const addCardPopupCloseButton = addCardPopup.querySelector('.popup__close');

const imagePopup = document.querySelector('.popup_type_image');
const imagePopupFullSize = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');
const imagePopupCloseButton = imagePopup.querySelector('.popup__close');

const formElement = document.querySelector('.popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

const cardAddForm = document.querySelector('form[name="new-place"]');
const cardNameInput = cardAddForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardAddForm.querySelector('.popup__input_type_url');

const cardsContainer = document.querySelector('.places__list');

profileEditButton.addEventListener('click', () => {
  openModal(editPopup);
  changeProfileData();
});

function closePopupListener(button, popup) {
  button.addEventListener('click', () => {
    closeModal(popup);
  });
}

closePopupListener(editPopupCloseButton, editPopup);
closePopupListener(addCardPopupCloseButton, addCardPopup);
closePopupListener(imagePopupCloseButton, imagePopup);

function changeProfileData() {
  profileNameInput.value = profileTitle.textContent;
  profilePositionInput.value = profileDescription.textContent;
}

addCardButton.addEventListener('click', () => {
  openModal(addCardPopup);
});

export function showImagePopup(event) {
  openModal(imagePopup);
  imagePopupFullSize.setAttribute('src', event.target.src);
  imagePopupFullSize.setAttribute('alt', event.target.alt);
  imagePopupCaption.textContent = event.target.alt;
}

function handleFormSubmit(event) {
  event.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editPopup);
}

formElement.addEventListener('submit', handleFormSubmit);

function addCard(event) {
  event.preventDefault();
  const cardElement = createCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  });
  cardsContainer.prepend(cardElement);
  cardAddForm.reset();
  closeModal(addCardPopup);
}

cardAddForm.addEventListener('submit', addCard);

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard);
  cardsContainer.appendChild(cardElement);
});