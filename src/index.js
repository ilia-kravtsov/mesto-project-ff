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

const editPopup = document.querySelector('.popup_type_edit');
const editPopupCloseButton = editPopup.querySelector('.popup__close');
const editSaveButton = editPopup.querySelector('.popup__button');
const profileEditForm = document.querySelector('form[name="edit-profile"]');
const profileNameInput = profileEditForm.querySelector(
  '.popup__input_type_name',
);
const profilePositionInput = profileEditForm.querySelector(
  '.popup__input_type_description',
);
const profileEditButton = document.querySelector('.profile__edit-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

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

const cardAddForm = document.forms['new-place'];
const cardNameInput = cardAddForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardAddForm.querySelector('.popup__input_type_url');

const cardsContainer = document.querySelector('.places__list');

const deletePopup = document.querySelector('.popup_type_delete');
const closeDeleteButton = deletePopup.querySelector('.popup__close');
const deleteForm = document.forms['delete-card'];

const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarChangeButton = document.querySelector('.profile__image-container');
const avatarCloseButton = avatarPopup.querySelector('.popup__close');
const avatarSaveButton = avatarPopup.querySelector('.popup__button');
const avatarChangeForm = document.forms['change-avatar'];
const avatarPopupInput = avatarChangeForm.querySelector(
  '.popup__input_type_url',
);

let profileId;

avatarChangeButton.addEventListener('click', () => {
  openModal(avatarPopup);
  avatarChangeForm.reset();
  clearValidation(avatarChangeForm, validationConfig);
});

profileEditButton.addEventListener('click', () => {
  openModal(editPopup);
  changeProfileData();
  clearValidation(profileEditForm, validationConfig);
});

function changeAvatarHandler(event) {
  event.preventDefault();
  const avatarLink = avatarPopupInput.value;

  const isValid = validateImageUrl(avatarLink);
  if (!isValid) {
    console.error('URL недоступен или не удалось установить соединение');
    return;
  }

  profileImage.src = avatarLink;
  showLoading(true, avatarSaveButton);
  avatarSaveButton.disabled = true;
  changeAvatar(avatarLink)
    .then((response) => {
      profileImage.src = response.avatar;
      closeModal(avatarPopup);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      avatarChangeForm.reset();
      showLoading(false, avatarSaveButton);
    });
}

avatarChangeForm.addEventListener('submit', changeAvatarHandler);

function changeProfileData() {
  profileNameInput.value = profileTitle.textContent;
  profilePositionInput.value = profileDescription.textContent;
}

function closePopupListener(button, popup) {
  button.addEventListener('click', () => {
    closeModal(popup);
  });
}

closePopupListener(editPopupCloseButton, editPopup);
closePopupListener(addCardPopupCloseButton, addCardPopup);
closePopupListener(imagePopupCloseButton, imagePopup);
closePopupListener(closeDeleteButton, deletePopup);
closePopupListener(avatarCloseButton, avatarPopup);

function openDeleteConfirmationPopup() {
  openModal(deletePopup);
}

function closeDeletePopup() {
  closeModal(deletePopup);
}

function deleteSomeCard({ cardId, deleteButton }) {
  deleteCard(cardId)
    .then(() => {
      const deleteItem = deleteButton.closest('.places__item');
      deleteItem.remove();
      closeDeletePopup();
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteCardFormHandler(event) {
  event.preventDefault();
  deleteSomeCard(getCurrentCard());
}

deleteForm.addEventListener('submit', deleteCardFormHandler);

addCardButton.addEventListener('click', () => {
  openModal(addCardPopup);
  cardAddForm.reset();
  clearValidation(cardAddForm, validationConfig);
});

function showImagePopup(event) {
  openModal(imagePopup);
  imagePopupFullSize.setAttribute('src', event.target.src);
  imagePopupFullSize.setAttribute('alt', event.target.alt);
  imagePopupCaption.textContent = event.target.alt;
}

function showLoading(isLoading, button) {
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
  button.disabled = isLoading;
}

function editProfileHandler(event) {
  event.preventDefault();
  showLoading(true, editSaveButton);
  editProfile(nameInput.value, jobInput.value)
    .then((response) => {
      profileTitle.textContent = response.name;
      profileDescription.textContent = response.about;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      showLoading(false, editSaveButton);
      closeModal(editPopup);
    });
}

formElement.addEventListener('submit', editProfileHandler);

function addCardHandler(event) {
  event.preventDefault();
  showLoading(true, editSaveButton);
  addCard(cardNameInput.value, cardLinkInput.value)
    .then((cardData) => {
      const cardElement = createCard(
        cardData,
        showImagePopup,
        profileId,
        openDeleteConfirmationPopup,
      );
      cardsContainer.prepend(cardElement);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      cardAddForm.reset();
      showLoading(false, editSaveButton);
      closeModal(addCardPopup);
    });
}

cardAddForm.addEventListener('submit', addCardHandler);

function createCards(initialCards, profileId) {
  initialCards.forEach((card) => {
    const cardElement = createCard(
      card,
      showImagePopup,
      profileId,
      openDeleteConfirmationPopup,
    );
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
  .catch((error) => {
    console.error('Failed to initialize app:', error);
  });

enableValidation(validationConfig);

