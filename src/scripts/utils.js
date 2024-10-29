export function renderLoading(
  isLoading,
  button,
  buttonText = 'Сохранить',
  loadingText = 'Сохранение...',
) {
  button.textContent = isLoading ? loadingText : buttonText;
}

export function handleSubmit(request, event, loadingText = 'Сохранение...') {
  event.preventDefault();

  const submitButton = event.submitter;
  const initialText = submitButton.textContent;

  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      event.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}