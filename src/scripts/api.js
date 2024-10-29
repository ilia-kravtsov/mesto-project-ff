const config = {
  baseUrl: 'https://nomoreparties.co/v1/cohort-mag-4',
  headers: {
    authorization: 'fdc03a01-5ab5-41f4-9c8c-147d1cd1160a',
    'Content-Type': 'application/json',
  },
};

async function checkResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    return Promise.reject(`Ошибка ${response.status}: ${errorText}`);
  }
  return response.json();
}

function request(endpoint, options = {}) {
  return fetch(`${config.baseUrl}${endpoint}`, {
    headers: config.headers,
    ...options,
  }).then(checkResponse)
}

export function getUserInfo() {
  return request('/users/me');
}

export function getInitialCards() {
  return request('/cards');
}

export function editProfile(nameValue, jobValue) {
  return request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({
      name: nameValue,
      about: jobValue,
    }),
  });
}

export function addCard(nameValue, linkValue) {
  return request('/cards', {
    method: 'POST',
    body: JSON.stringify({
      name: nameValue,
      link: linkValue,
    }),
  });
}

export function deleteCard(cardId) {
  return request(`/cards/${cardId}`, {
    method: 'DELETE',
  });
}

export function changeLikeStatus(cardId, isLiked) {
  return request(`/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
  });
}

export function changeAvatar(avatarLink) {
  return request('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({
      avatar: avatarLink,
    }),
  });
}

export function validateImageUrl(url) {
  const urlPattern = /\.(jpeg|jpg|gif|png)$/i;
  if (!urlPattern.test(url)) {
    console.error('Неверный формат URL изображения');
    return Promise.reject('Invalid image URL format');
  }
  return fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then((response) => response.ok)
}


