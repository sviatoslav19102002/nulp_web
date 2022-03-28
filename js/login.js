const button = document.querySelector('.input-button');
const form = document.querySelector('#login-form');

function loginUser(body) {
  return fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });
}

async function buttonHandler(event) {
  if (form.checkValidity()) {
    event.preventDefault();

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const entry = {
      username: username.value,
      password: password.value,
    };

    loginUser(entry)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.text();
      })
      .then(() => {
        window.localStorage.setItem('current_user', JSON.stringify(entry));
        window.location.href = 'edit_user.html';
      })
      .catch((error) => {
        console.log(`Fetch error: ${error}`);
      });
  }
}

button.addEventListener('click', buttonHandler);
