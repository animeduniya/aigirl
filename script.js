// Load Three.js and 3D Avatar
let scene, camera, renderer, model;
const container = document.getElementById('avatar-container');

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(500, 500);
  container.appendChild(renderer.domElement);

  const loader = new THREE.GLTFLoader();
  loader.load('https://modelviewer.dev/shared-assets/models/Astronaut.glb', (gltf) => {
    model = gltf.scene;
    scene.add(model);
    animate();
  });

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 5);
  scene.add(light);
}

// Voice Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

function startVoiceRecognition() {
  document.getElementById("userSpeech").innerText = "Listening...";
  recognition.start();
}

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript.toLowerCase();
  document.getElementById("userSpeech").innerText = "You: " + transcript;
  fetchAnswerFromWikipedia(transcript);
};

// Wikipedia API for AI Chat
function fetchAnswerFromWikipedia(question) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(question)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('No information found');
      return response.json();
    })
    .then(data => {
      document.getElementById("response").innerText = data.extract || "No relevant information found.";
      speak(data.extract || "I couldn't find an answer.");
    })
    .catch(() => {
      document.getElementById("response").innerText = "Sorry, I couldn't find an answer.";
      speak("Sorry, I couldn't find an answer.");
    });
}

// Text-to-Speech
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

// 3D Animation
function animate() {
  requestAnimationFrame(animate);
  model.rotation.y += 0.003;
  renderer.render(scene, camera);
}

init3D();
