const logout = document.querySelector('.logout');

async function formHandler(event) {
  event.preventDefault();

  window.localStorage.clear();
  window.location.href = 'login.html';
}

logout.addEventListener('submit', formHandler);
