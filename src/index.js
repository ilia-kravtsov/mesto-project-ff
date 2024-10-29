import './pages/index.css';
import { createCard, getCurrentCard } from './scripts/card.js';
import { openModal, closeModal } from './scripts/modal.js';
import {
  enableValidation,
  clearValidation,
  validationConfig,
} from './scripts/validation.js';
import {
  getUserInfo,
  getInitialCards,
  editProfile,
  addCard,
  deleteCard,
  changeAvatar,
  validateImageUrl,
} from './scripts/api.js';
import { handleSubmit } from './scripts/utils.js';

const profileForm = document.forms['edit-profile'];
const profileFormNameInput = profileForm.querySelector('.popup__input_type_name');
const profileFormJobInput = profileForm.querySelector('.popup__input_type_description');
const profileEditPopup = document.querySelector('.popup_type_edit');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const addCardButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');

const imagePopup = document.querySelector('.popup_type_image');
const imagePopupFullSize = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const cardAddForm = document.forms['new-place'];
const cardNameInput = cardAddForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardAddForm.querySelector('.popup__input_type_url');
const cardsContainer = document.querySelector('.places__list');

const deleteForm = document.forms['delete-card'];
const deletePopup = document.querySelector('.popup_type_delete');

const avatarChangeForm = document.forms['change-avatar'];
const avatarChangeButton = document.querySelector('.profile__image-container');
const avatarPopupInput = avatarChangeForm.querySelector('.popup__input_type_url');
const avatarPopup = document.querySelector('.popup_type_avatar');

const closeButtons = document.querySelectorAll('.popup__close');

let profileId;

function openDeleteConfirmationPopup() {
  openModal(deletePopup);
}

function closeDeletePopup() {
  closeModal(deletePopup);
}

closeButtons.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

avatarChangeButton.addEventListener('click', () => {
  openModal(avatarPopup);
  clearValidation(avatarChangeForm, validationConfig);
});

profileEditButton.addEventListener('click', () => {
  openModal(profileEditPopup);
  profileFormNameInput.value = profileTitle.textContent;
  profileFormJobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
});

addCardButton.addEventListener('click', () => {
  openModal(addCardPopup);
  clearValidation(cardAddForm, validationConfig);
});

function handleChangeAvatarSubmit(evt) {
  function makeRequest() {
    const avatarLink = avatarPopupInput.value;
    const isValid = validateImageUrl(avatarLink);
    if (!isValid) {
      console.error('URL недоступен или не удалось установить соединение');
      return Promise.reject(new Error('Некорректный URL'));
    }
    return changeAvatar(avatarLink).then((response) => {
      profileImage.src = response.avatar;
      closeModal(avatarPopup);
    });
  }

  handleSubmit(makeRequest, evt);
}

avatarChangeForm.addEventListener('submit', handleChangeAvatarSubmit);

function handleDeleteCard({ cardId, deleteButton }) {
  deleteCard(cardId)
    .then(() => {
      deleteButton.closest('.places__item').remove();
      closeDeletePopup();
    })
    .catch(console.error);
}

function handleDeleteCardSubmit(event) {
  event.preventDefault();
  handleDeleteCard(getCurrentCard());
}

deleteForm.addEventListener('submit', handleDeleteCardSubmit);

function showImagePopup(event) {
  openModal(imagePopup);
  imagePopupFullSize.setAttribute('src', event.target.src);
  imagePopupFullSize.setAttribute('alt', event.target.alt);
  imagePopupCaption.textContent = event.target.alt;
}

function handleProfileFormSubmit(evt) {
  function makeRequest() {
    return editProfile(profileFormNameInput.value, profileFormJobInput.value).then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profileEditPopup);
    });
  }
  handleSubmit(makeRequest, evt);
}

profileForm.addEventListener('submit', handleProfileFormSubmit);

function handleAddCardSubmit(evt) {
  function makeRequest() {
    return addCard(cardNameInput.value, cardLinkInput.value).then(
      (cardData) => {
        const cardElement = createCard({
          cardData,
          showImagePopup,
          profileId,
          openDeleteConfirmationPopup,
        });
        cardsContainer.prepend(cardElement);
        closeModal(addCardPopup);
      },
    );
  }
  handleSubmit(makeRequest, evt);
}

cardAddForm.addEventListener('submit', handleAddCardSubmit);

function createCards(initialCards, profileId) {
  initialCards.forEach((cardData) => {
    const cardElement = createCard({
      cardData,
      showImagePopup,
      profileId,
      openDeleteConfirmationPopup,
    });
    cardsContainer.appendChild(cardElement);
  });
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, initialCardsData]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.src = userData.avatar;
    profileId = userData._id;
    createCards(initialCardsData, profileId);
  })
  .catch(console.error);

enableValidation(validationConfig);
