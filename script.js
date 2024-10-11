document.getElementById('login-button').addEventListener('click', loginUser);
document.getElementById('register-submit-button')?.addEventListener('click', registerUser);
document.getElementById('send-button')?.addEventListener('click', sendMessage);
document.getElementById('create-server-button')?.addEventListener('click', createServer);

let currentUser = null;
let currentChannel = 'general'; // Default channel
let currentServer = null; // Current server

// Load servers into the server list dropdown
function loadServers() {
    fetch('servers.txt')
        .then(response => response.text())
        .then(data => {
            const servers = data.trim().split('\\n').slice(1); // Ignore header
            const serverSelect = document.getElementById('server-select');
            servers.forEach(serverLine => {
                const [serverId, serverName] = serverLine.split('|');
                const option = document.createElement('option');
                option.value = serverId;
                option.textContent = serverName;
                serverSelect.appendChild(option);
            });
        });
}

function loginUser() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (username && password) {
        fetch('users.txt')
            .then(response => response.text())
            .then(data => {
                const users = data.trim().split('\\n').slice(1); // Ignore header line
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
                const users = data.trim().split('\\n');
                const userId = users.length; // New user ID based on length
                const newUser = `${userId}|${username}|${password}|user|online\\n`;

                // Update users.txt by simulating writing new user to file (in real-world projects, use a backend server)
                const updatedUsers = data + newUser;
                alert('Registration successful! Now you can log in.');
                console.log(updatedUsers);  // Simulate saving new user
                window.location.href = "login.html"; // Redirect back to login page
            });
    } else {
        alert('Please fill in both username and password.');
    }
}

// Set current server from the dropdown
document.getElementById('server-select')?.addEventListener('change', function () {
    currentServer = this.value;
    console.log(`Current server set to: ${currentServer}`);
});

function createServer() {
    const serverName = document.getElementById('server-name').value.trim();
    if (serverName !== '') {
        fetch('servers.txt')
            .then(response => response.text())
            .then(data => {
                const servers = data.trim().split('\\n');
                const serverId = servers.length; // New server ID based on length
                const newServer = `${serverId}|${serverName}\\n`;
                
                // Simulate adding new server to servers.txt
                const updatedServers = data + newServer;
                alert('Server created: ' + serverName);
                console.log(updatedServers);  // Simulate saving new server
            });
    }
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageContent = messageInput.value.trim();

    if (messageContent !== '' && currentServer) {
        const chatWindow = document.getElementById('chat-window');
        const messageElement = document.createElement('div');
        messageElement.textContent = `${currentUser.userName} [${currentServer}]: ${messageContent}`;
        chatWindow.appendChild(messageElement);
        messageInput.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveMessageToFile(messageContent);
    } else {
        alert('Please select a server before sending a message.');
    }
}

function saveMessageToFile(message) {
    console.log(`Message saved in ${currentServer}: ${message}`);
}
