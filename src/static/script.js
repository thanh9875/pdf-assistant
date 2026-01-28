// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

// State
let currentFilename = null;
const API_BASE_URL = 'http://localhost:5000';

// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        sendMessage();
    }
});

/**
 * Handle file upload
 */
async function handleFileUpload() {
    const file = fileInput.files[0];
    
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a PDF file');
        return;
    }
    
    // Show uploading status
    uploadBtn.disabled = true;
    uploadBtn.textContent = '⏳ Uploading...';
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentFilename = data.filename;
            fileName.textContent = `📄 ${data.filename}`;
            fileInfo.classList.remove('hidden');
            
            // Enable chat
            messageInput.disabled = false;
            sendBtn.disabled = false;
            
            // Clear welcome message and show success
            chatMessages.innerHTML = '';
            addMessage('bot', `✅ PDF uploaded successfully! I've read "${data.filename}". You can now ask me questions about its content.`);
            
            // Reset upload button
            uploadBtn.textContent = '📁 Choose PDF File';
            uploadBtn.disabled = false;
        } else {
            alert(`Error: ${data.error}`);
            uploadBtn.textContent = '📁 Choose PDF File';
            uploadBtn.disabled = false;
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file. Make sure the server is running.');
        uploadBtn.textContent = '📁 Choose PDF File';
        uploadBtn.disabled = false;
    }
}

/**
 * Send message to chatbot
 */
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!currentFilename) {
        alert('Please upload a PDF file first');
        return;
    }
    
    // Display user message
    addMessage('user', message);
    messageInput.value = '';
    
    // Disable input while waiting for response
    messageInput.disabled = true;
    sendBtn.disabled = true;
    
    // Show loading message
    const loadingId = addMessage('bot', '💭 Thinking...', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                filename: currentFilename
            })
        });
        
        const data = await response.json();
        
        // Remove loading message
        removeMessage(loadingId);
        
        if (response.ok) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', `❌ Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Chat error:', error);
        removeMessage(loadingId);
        addMessage('bot', '❌ Failed to get response. Please check if the server is running.');
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

/**
 * Add message to chat
 */
function addMessage(type, text, isLoading = false) {
    const messageDiv = document.createElement('div');
    const messageId = `msg-${Date.now()}`;
    messageDiv.id = messageId;
    messageDiv.className = `message ${type}-message${isLoading ? ' loading' : ''}`;
    messageDiv.textContent = text;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageId;
}

/**
 * Remove message from chat
 */
function removeMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}
