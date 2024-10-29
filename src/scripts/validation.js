export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

function showInputError(formElement, inputElement, errorMessage) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
}

function hideInputError(formElement, inputElement) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(validationConfig.errorClass);
}

function isValid(formElement, inputElement) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
}

function setEventListeners(formElement, config = validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement, config.inactiveButtonClass);
    });
  });
}

export function enableValidation(config = validationConfig) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => setEventListeners(formElement, config));
}

function disableButton(button, inactivateClass) {
  button.classList.add(inactivateClass);
  button.disabled = true;
}

function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  if (inputList.every((inputElement) => inputElement.validity.valid)) {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false;
  } else {
    disableButton(buttonElement, inactiveButtonClass);
  }
}

export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector),
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector,
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
    inputElement.setCustomValidity('');
  });

  disableButton(buttonElement, validationConfig.inactiveButtonClass);
}

