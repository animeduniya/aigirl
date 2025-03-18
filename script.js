let scene, camera, renderer, model;
const container = document.getElementById('avatar-container');

// Initialize 3D Model
function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(500, 500);
  container.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load('https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.002;
  }
  renderer.render(scene, camera);
}

// Voice Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

function startVoiceRecognition() {
  recognition.start();
}

recognition.onresult = function (event) {
  const question = event.results[0][0].transcript;
  document.getElementById("userInput").value = question;
  askLucy();
};

// AI Logic with JSON-based Responses
const responses = {
  "hello": "Hi! How can I assist you today?",
  "who are you": "I'm Lucy, created by Rishab.",
  "how are you": "I'm just a virtual assistant, but I'm feeling great!",
  "bye": "Goodbye! Have a great day!",
  "creator": "I was created by Rishab, a talented developer!"
};

function askLucy() {
  const question = document.getElementById("userInput").value.toLowerCase();
  const responseElement = document.getElementById("response");
  
  if (responses[question]) {
    responseElement.innerText = `Lucy: ${responses[question]}`;
    speak(responseElement.innerText);
  } else {
    responseElement.innerText = `Lucy: Sorry, I couldn't find an answer. Try a different question.`;
    speak(responseElement.innerText);
  }
}

// Voice Response
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

// Background Music Control
const bgMusic = document.getElementById('backgroundMusic');
bgMusic.volume = 0.2;

init3D();
