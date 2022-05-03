const chat = document.querySelector('#chat');
const registration = document.querySelector('#registration');
const sendButton = document.querySelector('#send_button');
const messagesContainer = document.querySelector('#messages');
const inputBox = document.querySelector('#inputBox');
const submitButton = document.querySelector('#form_button');

let userName = '';

let socket = new WebSocket('ws://localhost:8080');

submitButton.onclick = function () {
    let input = document.querySelector('#username');
    userName = input.value;
    registration.style.display = 'none';
    chat.style.display = 'block';
}

const form=document.getElementById('input_container');

form.addEventListener('submit',(event) => {
    event.preventDefault();
    let data = {
        message: inputBox.value,
        userName: userName
    };

    socket.send(JSON.stringify(data));

    createMessageBox(data);
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    inputBox.value = '';
    sendButton.disabled = true;
});

inputBox.addEventListener('input',(event) => {
    sendButton.disabled = !event.target.value;
});

socket.onmessage = ({ data }) => {
    data = JSON.parse(data);
    createMessageBox(data);
}

function createMessageBox(data) {
    let msgDiv = document.createElement('div');
    let text = document.createElement('p');
    let userName = document.createElement('span');
    msgDiv.classList.add('msgCtn');
    text.className = 'message';
    userName.className = 'username';

    text.textContent = data.message;
    userName.textContent = data.userName;

    msgDiv.appendChild(userName);
    msgDiv.appendChild(text);
    document.getElementById('messages').appendChild(msgDiv)
}