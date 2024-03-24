// Initialize the chatbot
function initChatbot() {
    const chatContainer = document.getElementById("chat-container");
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatContainer.appendChild(chatWindow);

    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener('click', sendMessage);
}

// Function to handle sending messages
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";

    const chatWindow = document.getElementById("chat-window");
    displayMessage(userInput, "user", chatWindow); //

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ text: userInput })
        });
        const data = await response.json();
        displayMessage(data.response, "bot", chatWindow);
    } catch (error) {
        console.error("Error:", error);
        displayMessage("An error occured. Please try again later.", "error", chatWindow);
    }
}

function displayMessage(message, type, chatWindow) {
    const messageElement = document.createElement("p");
    messageElement.classList.add("message", type);
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function displayThinkingMessage(chatWindow) {
    const thinkingElement = document.createElement("p");
    thinkingElement.classList.add("message", "thinking");
    thinkingElement.textContent = "Thinking...";
    chatWindow.appendChild(thinkingElement);

    setTimeout(() => {
        chatWindow.removeChild(thinkingElement);
    }, 1000);
}

function toggleChat() {
    var chatContainer = document.getElementById('chat-container');
    var chatToggle = document.getElementById('chat-toggle');
    if (chatContainer.style.display === 'none') {
        chatContainer.style.display = 'block';
        chatToggle.style.display = 'none';
    } else {
        chatContainer.style.display = 'none';
        chatToggle.style.display = 'flex';
    }
}
document.getElementById('toggle-chat-button').addEventListener('click', function() {
    var chatContainer = document.getElementById('chat-container');
    var chatToggle = document.getElementById('chat-toggle');
    if (chatContainer.style.display === 'none') {
        chatContainer.style.display = 'block';
        chatToggle.style.display = 'none';
    }
});
document.getElementById('close-button').addEventListener('click', function() {
    var chatContainer = document.getElementById('chat-container');
    var chatToggle = document.getElementById('chat-toggle');
    if (chatContainer.style.display === 'block') {
        chatContainer.style.display = 'none';
        chatToggle.style.display = 'flex';
    }
});


document.addEventListener('DOMContentLoaded', initChatbot); 