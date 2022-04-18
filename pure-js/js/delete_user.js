const form = document.querySelector('.delete');

function deleteUser(body) {
  const headers = new Headers();
  headers.set('Authorization', `Basic ${btoa(`${body.username}:${body.password}`)}`);
  headers.set('content-type', 'application/json');
  return fetch('http://localhost:8080/api/v1/user/delete', {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers,
  });
}

async function formHandler(event) {
  event.preventDefault();

  const currentuser = window.localStorage.getItem('current_user');

  const entry = {
    username: JSON.parse(currentuser).username,
    password: JSON.parse(currentuser).password,
  };

  deleteUser(entry)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.text();
    })
    .then(() => {
      window.localStorage.clear();
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.log(`Fetch error: ${error}`);
    });
}

form.addEventListener('submit', formHandler);
