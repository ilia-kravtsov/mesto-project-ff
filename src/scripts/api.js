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

export async function getUserInfo() {
  try {
    const response = await fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers,
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  }
}

export async function getInitialCards() {
  try {
    const response = await fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to fetch initial cards:', error);
  }
}

export async function editProfile(nameValue, jobValue) {
  try {
    const response = await fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        name: nameValue,
        about: jobValue,
      }),
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to edit profile:', error);
  }
}

export async function addCard(nameValue, linkValue) {
  try {
    const response = await fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        name: nameValue,
        link: linkValue,
      }),
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to add card:', error);
  }
}

export async function deleteCard(cardId) {
  try {
    const response = await fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to delete card:', error);
  }
}

export async function changeLikeStatus(cardId, isLiked) {
  try {
    const response = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: config.headers,
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to change like status:', error);
  }
}

export async function changeAvatar(avatarLink) {
  try {
    const response = await fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        avatar: avatarLink,
      }),
    });
    return await checkResponse(response);
  } catch (error) {
    console.error('Failed to change avatar:', error);
  }
}

export async function validateImageUrl(url) {
  try {
    // eсли выстраивать запрос как требуется в задании, то встретимся c CORS
    // поэтому провалидировал то, что можно провалидировать с mode: 'no-cors'
    // так встретим CORS:
    // const response = await fetch(url, { method: 'HEAD' });
    // if (response.ok && response.headers.get('Content-Type')?.startsWith('image/')) {
    //   return true;
    // }
    const urlPattern = /\.(jpeg|jpg|gif|png)$/i;
    if (!urlPattern.test(url)) {
      console.error('Неверный формат URL изображения');
    }
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Ошибка при проверке URL:', error);
    return false;
  }
}

