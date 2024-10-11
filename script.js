
document.getElementById('login-button').addEventListener('click', loginUser);
document.getElementById('register-submit-button')?.addEventListener('click', registerUser);
document.getElementById('send-button')?.addEventListener('click', sendMessage);
document.getElementById('create-server-button')?.addEventListener('click', createServer);

let currentUser = null;
let currentChannel = 'general'; // Default channel

function loginUser() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (username && password) {
        fetch('users.txt')
            .then(response => response.text())
            .then(data => {
                const users = data.trim().split('\n').slice(1); // Ignore header line
                let found = false;
                users.forEach(userLine => {
                    const [userId, userName, userPassword, role, status] = userLine.split('|');
                    if (username === userName && password === userPassword) {
                        found = true;
                        currentUser = { userId, userName, role, status };
                        alert('Login successful as ' + userName + ' with role ' + role);
                        window.location.href = "main.html"; // Redirect to chat page
                    }
                });
                if (!found) {
                    alert('Invalid login. Please try again.');
                }
            });
    }
}

function registerUser() {
    const username = document.getElementById('reg-username-input').value.trim();
    const password = document.getElementById('reg-password-input').value.trim();

    if (username && password) {
        fetch('users.txt')
            .then(response => response.text())
            .then(data => {
                const users = data.trim().split('\n');
                const userId = users.length; // New user ID based on length
                const newUser = `${userId}|${username}|${password}|user|online\n`;

                // Update users.txt by simulating writing new user to file (in real-world projects, use a backend server)
                const updatedUsers = data + newUser;
                alert('Registration successful! Now you can log in.');
                // You would normally update the file server-side, but we'll simulate the process here.
                console.log(updatedUsers);
                window.location.href = "login.html"; // Redirect back to login page
            });
    } else {
        alert('Please fill in both username and password.');
    }
}

function createServer() {
    const serverName = document.getElementById('server-name').value.trim();
    if (serverName !== '') {
        saveServerToFile(serverName);
        alert('Server created: ' + serverName);
    }
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageContent = messageInput.value.trim();

    if (messageContent !== '') {
        const chatWindow = document.getElementById('chat-window');
        const messageElement = document.createElement('div');
        messageElement.textContent = `${currentUser.userName} [${currentChannel}]: ${messageContent}`;
        chatWindow.appendChild(messageElement);
        messageInput.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveMessageToFile(messageContent);
    }
}

function saveMessageToFile(message) {
    console.log(`Message saved in ${currentChannel}: ${message}`);
}

function saveServerToFile(serverName) {
    console.log(`Server saved: ${serverName}`);
}
