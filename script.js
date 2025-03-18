// === Background Music ===
const music = document.getElementById('backgroundMusic');

// === Chat Logic ===
const messagesDiv = document.getElementById('messages');
const inputField = document.getElementById('userInput');

// Memory Storage
const memory = JSON.parse(localStorage.getItem('lucyMemory')) || {};

function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage('You: ' + userMessage);
  inputField.value = '';

  const lucyResponse = generateResponse(userMessage);
  appendMessage('Lucy: ' + lucyResponse);
  speak(lucyResponse);
}

function appendMessage(text) {
  const msg = document.createElement('p');
  msg.textContent = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// === AI Response Logic ===
function generateResponse(question) {
  // Simple memory-based response
  if (question.toLowerCase().includes('my name')) {
    if (!memory.name) {
      memory.name = prompt("What's your name?");
      localStorage.setItem('lucyMemory', JSON.stringify(memory));
      return `Nice to meet you, ${memory.name}!`;
    }
    return `Your name is ${memory.name}!`;
  }

  // Example Logic
  const responses = {
    "hello": "Hi there! How can I assist you today?",
    "how are you": "I'm feeling great! How about you?",
    "who created you": "I was created by Rishab!",
    "what's your name": "I'm Lucy, your AI assistant!",
    "bye": "Goodbye! See you soon!"
  };

  for (const key in responses) {
    if (question.toLowerCase().includes(key)) {
      return responses[key];
    }
  }

  return "Sorry, I couldn't find an answer. Try a different question.";
}

// === Voice Recognition ===
function startVoiceRecognition() {
  const recognition = new window.SpeechRecognition();
  recognition.onresult = (event) => {
    const voiceText = event.results[0][0].transcript;
    inputField.value = voiceText;
    sendMessage();
  };
  recognition.start();
}

// === Speech Output ===
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US';
  speech.pitch = 1.2;
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
}

// === 3D Model Rendering ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('lucyCanvas') });

renderer.setSize(window.innerWidth * 0.65, window.innerHeight);
camera.position.set(0, 1.6, 3);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

const loader = new THREE.GLTFLoader();
loader.load('model.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  animate();
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
