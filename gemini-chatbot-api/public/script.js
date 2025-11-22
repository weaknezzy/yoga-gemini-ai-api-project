const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Show a temporary "Thinking..." message
  const thinkingMsg = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: [{ role: 'user', text: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server.');
    }

    const data = await response.json();

    if (data.result) {
      // Replace "Thinking..." with the actual response
      thinkingMsg.textContent = data.result;
    } else {
      thinkingMsg.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error:', error);
    // Update the message to show an error
    thinkingMsg.textContent = 'Failed to get response from server.';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the message element
}
