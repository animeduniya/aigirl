// === Background Music ===
const music = document.getElementById('backgroundMusic');

// === Chat Logic ===
const messagesDiv = document.getElementById('messages');
const inputField = document.getElementById('userInput');

// AI Emotions & Memory
let mood = 'neutral';
const memory = JSON.parse(localStorage.getItem('lucyMemory')) || {};

// === Append Chat Messages ===
function appendMessage(text, isLucy = false) {
  const msg = document.createElement('p');
  msg.textContent = text;
  msg.style.color = isLucy ? '#007bff' : '#ffffff';
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// === Handle User Messages ===
function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage('You: ' + userMessage);
  inputField.value = '';

  const lucyResponse = generateResponse(userMessage);
  appendMessage('Lucy: ' + lucyResponse, true);
  speak(lucyResponse);
}

// === AI Knowledge Base ===
function generateResponse(question) {
  const responses = {
    "hello": "Hi there! How can I help you today?",
    "how are you": `I'm feeling ${mood}, thank you for asking.`,
    "who created you": "I was created by Rishab!",
    "what's your name": "I'm Lucy, your AI friend.",
    "bye": "Goodbye! Take care!",
  };

  // Memory Check
  if (question.toLowerCase().includes('my name')) {
    if (!memory.name) {
      memory.name = prompt("What's your name?");
      localStorage.setItem('lucyMemory', JSON.stringify(memory));
      return `Nice to meet you, ${memory.name}!`;
    }
    return `Your name is ${memory.name}.`;
  }

  // Mood Check
  if (question.toLowerCase().includes('sad')) {
    mood = 'sad';
    return "I'm sorry you're feeling that way. I'm here to listen.";
  }
  if (question.toLowerCase().includes('happy')) {
    mood = 'happy';
    return "That's wonderful! I'm happy for you!";
  }

  // Provide answers
  for (const key in responses) {
    if (question.toLowerCase().includes(key)) {
      return responses[key];
    }
  }

  // No Match
  return "I'm not sure about that. Maybe you can try a different question!";
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

// === Text to Speech ===
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US';
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

// Load 3D Model
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
