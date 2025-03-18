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
  loader.load('https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/AnimatedMorphSphere/glTF/AnimatedMorphSphere.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    model.position.y = -1;
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
  document.getElementById("userSpeech").innerText = "Listening...";
  recognition.start();
}

recognition.onresult = function (event) {
  const question = event.results[0][0].transcript;
  document.getElementById("userSpeech").innerText = `You: ${question}`;
  fetchAnswer(question);
};

// Fetch Wikipedia Answer
function fetchAnswer(question) {
  const searchTerm = encodeURIComponent(question);
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const answer = data.extract || "I couldn't find the answer. Please try a different question.";
      document.getElementById("response").innerText = `Lucy: ${answer}`;
      speakAnswer(answer);
    })
    .catch(() => {
      document.getElementById("response").innerText = "Lucy: I couldn't find an answer. Please try again.";
      speakAnswer("I couldn't find an answer. Please try again.");
    });
}

// Text-to-Speech
function speakAnswer(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

// Background Music Control
const bgMusic = document.getElementById('backgroundMusic');
bgMusic.volume = 0.2;

init3D();
