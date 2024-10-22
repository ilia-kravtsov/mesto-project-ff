function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.currentTarget);
  }
}

function onEscapeKeyDown(event) {
  if (event.key === 'Escape') {
    closeModal(document.querySelector('.popup_is-opened'));
  }
}

export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', onEscapeKeyDown);
  popup.addEventListener('mousedown', onOverlayClick);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', onEscapeKeyDown);
  popup.removeEventListener('mousedown', onOverlayClick);
}
