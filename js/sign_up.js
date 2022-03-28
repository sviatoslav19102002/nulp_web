const button = document.querySelector('.input-button');
const form = document.querySelector('#signup-form');

function signupUser(body) {
  return fetch('http://localhost:8080/api/v1/auth/register', {
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
    const firstname = document.getElementById('first_name');
    const secondname = document.getElementById('second_name');
    const email = document.getElementById('email');

    const entry = {
      first_name: firstname.value,
      second_name: secondname.value,
      username: username.value,
      password: password.value,
      email: email.value,
    };

    signupUser(entry)
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
