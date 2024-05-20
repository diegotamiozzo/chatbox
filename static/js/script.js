document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-button');
    const copyButton = document.getElementById('copy-button');
    const clearButton = document.getElementById('clear-button');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Função para enviar a mensagem para o chatbot
    sendButton.addEventListener('click', async () => {
        const userInputValue = userInput.value.trim();
        if (userInputValue !== '') {
            // Obter ID de usuário (pode ser gerado aleatoriamente)
            const userId = generateUserId(); 

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInputValue, user_id: userId }),
            });

            const data = await response.json();
            addMessage('user', userInputValue);
            addMessage('bot', data.response);
            userInput.value = '';
        }
    });

    // Função para copiar as respostas do bot
    copyButton.addEventListener('click', function() {
        const botMessages = document.querySelectorAll('.bot-message');
        let textToCopy = '';
        botMessages.forEach(message => {
            textToCopy += message.textContent + '\n';
        });

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Respostas copiadas para a área de transferência!');
        }).catch(err => {
            alert('Falha ao copiar: ', err);
        });
    });

    // Função para limpar o chat e o campo de entrada
    clearButton.addEventListener('click', function() {
        chatBox.innerHTML = '';
        userInput.value = '';
    });

    // Função para adicionar uma mensagem ao chat
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.innerHTML = `<strong>${sender === 'user' ? 'Você' : 'Bot'}:</strong> ${text}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Função para gerar um ID de usuário aleatório (opcional)
    function generateUserId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
});
