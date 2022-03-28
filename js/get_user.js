function getUser(body) {
  const headers = new Headers();
  headers.set('Authorization', `Basic ${btoa(`${body.username}:${body.password}`)}`);
  headers.set('content-type', 'application/json');
  return fetch('http://localhost:8080/api/v1/user/get', {
    method: 'GET',
    headers,
  });
}

async function getHandler() {
  const currentuser = window.localStorage.getItem('current_user');

  const entry = {
    username: JSON.parse(currentuser).username,
    password: JSON.parse(currentuser).password,
  };
  const response = await getUser(entry);
  const responseText = JSON.parse(await response.text());
  if (response.ok) {
    document.getElementById('username').innerHTML = `${responseText.first_name} ${responseText.second_name}`;
    return true;
  }

  // errorText.innerText = responseText.message;
  return false;
}

getHandler();
