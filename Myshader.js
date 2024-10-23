import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Setup Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Global clock for animation
const clock = new THREE.Clock();

// Create geometry for shader manipulation
const geometry = new THREE.SphereGeometry(5, 128, 128);  // Higher detail for smoother deformation

// Audio listener and analyzer (for real-time audio data)
const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
const analyser = new THREE.AudioAnalyser(audio, 512);  // More frequency data

// Load an audio file and set it to play
audioLoader.load('your_audio_file.mp3', function(buffer) {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.play();
});

// Shader material with GLSL code
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0.0 },
        uAmplitudeBass: { value: 0.0 },
        uAmplitudeMid: { value: 0.0 },
        uAmplitudeTreble: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uGlowStrength: { value: 1.5 },  // Bloom effect strength
        uDistortionFactor: { value: 1.0 }  // Extra distortion factor for more dynamic effects
    },
    vertexShader: `
        uniform float uTime;
        uniform float uAmplitudeBass;
        uniform float uDistortionFactor;

        varying vec2 vUv;
        varying float vDistortion;

        void main() {
            vUv = uv;
            vec3 pos = position;

            // Audio-driven vertex distortion based on bass frequency
            float distortion = sin(pos.y * 5.0 + uTime) * uAmplitudeBass * uDistortionFactor;
            pos.z += distortion;

            vDistortion = distortion;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uAmplitudeMid;
        uniform float uAmplitudeTreble;
        uniform float uGlowStrength;
        uniform vec2 uResolution;

        varying vec2 vUv;
        varying float vDistortion;

        // Fractal noise for texture distortion and patterns
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                       mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
        }

        float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 2.0;

            for (int i = 0; i < 5; i++) {
                value += amplitude * noise(st * frequency);
                frequency *= 2.0;
                amplitude *= 0.5;
            }

            return value;
        }

        void main() {
            vec2 st = vUv * uResolution / min(uResolution.x, uResolution.y);
            float trebleDistort = fbm(st + uTime * 0.1) * uAmplitudeTreble;

            // Color modulation based on mid and treble frequencies
            vec3 color = vec3(0.0);
            color.r = fbm(st * 0.5 + uAmplitudeMid * 0.1);
            color.g = fbm(st + uTime * 0.2 + uAmplitudeMid * 0.2);
            color.b = fbm(st + uTime * 0.3 + uAmplitudeTreble * 0.3);

            // Apply glow effect based on treble amplitude
            color += vec3(uGlowStrength) * uAmplitudeTreble;

            gl_FragColor = vec4(color, 1.0);
        }
    `,
    side: THREE.DoubleSide,
    transparent: true,
});

// Create a mesh with shader material
const mesh = new THREE.Mesh(geometry, shaderMaterial);
scene.add(mesh);

// Set camera position
camera.position.z = 12;

// Post-processing (bloom effect)
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // Bloom intensity
    0.4, // Bloom threshold
    0.85 // Bloom radius
);
composer.addPass(bloomPass);

// Create a particle system that reacts to audio
const particleCount = 500;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
    particlePositions[i] = (Math.random() - 0.5) * 50;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Animation loop
function animate() {import * as THREE from 'three';
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
    
    // Setup Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Global clock for animation
    const clock = new THREE.Clock();
    
    // Create geometry for shader manipulation
    const geometry = new THREE.SphereGeometry(5, 128, 128);  // Higher detail for smoother deformation
    
    // Audio listener and analyzer (for real-time audio data)
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    const analyser = new THREE.AudioAnalyser(audio, 512);  // More frequency data
    
    // Load an audio file and set it to play
    audioLoader.load('your_audio_file.mp3', function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.play();
    });
    
    // Shader material with GLSL code
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uAmplitudeBass: { value: 0.0 },
            uAmplitudeMid: { value: 0.0 },
            uAmplitudeTreble: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uGlowStrength: { value: 1.5 },  // Bloom effect strength
            uDistortionFactor: { value: 1.0 }  // Extra distortion factor for more dynamic effects
        },
        vertexShader: `
            uniform float uTime;
            uniform float uAmplitudeBass;
            uniform float uDistortionFactor;
    
            varying vec2 vUv;
            varying float vDistortion;
    
            void main() {
                vUv = uv;
                vec3 pos = position;
    
                // Audio-driven vertex distortion based on bass frequency
                float distortion = sin(pos.y * 5.0 + uTime) * uAmplitudeBass * uDistortionFactor;
                pos.z += distortion;
    
                vDistortion = distortion;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uAmplitudeMid;
            uniform float uAmplitudeTreble;
            uniform float uGlowStrength;
            uniform vec2 uResolution;
    
            varying vec2 vUv;
            varying float vDistortion;
    
            // Fractal noise for texture distortion and patterns
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
    
            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                           mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
            }
    
            float fbm(vec2 st) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 2.0;
    
                for (int i = 0; i < 5; i++) {
                    value += amplitude * noise(st * frequency);
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }
    
                return value;
            }
    
            void main() {
                vec2 st = vUv * uResolution / min(uResolution.x, uResolution.y);
                float trebleDistort = fbm(st + uTime * 0.1) * uAmplitudeTreble;
    
                // Color modulation based on mid and treble frequencies
                vec3 color = vec3(0.0);
                color.r = fbm(st * 0.5 + uAmplitudeMid * 0.1);
                color.g = fbm(st + uTime * 0.2 + uAmplitudeMid * 0.2);
                color.b = fbm(st + uTime * 0.3 + uAmplitudeTreble * 0.3);
    
                // Apply glow effect based on treble amplitude
                color += vec3(uGlowStrength) * uAmplitudeTreble;
    
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.DoubleSide,
        transparent: true,
    });
    
    // Create a mesh with shader material
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);
    
    // Set camera position
    camera.position.z = 12;
    
    // Post-processing (bloom effect)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Bloom intensity
        0.4, // Bloom threshold
        0.85 // Bloom radius
    );
    composer.addPass(bloomPass);
    
    // Create a particle system that reacts to audio
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 50;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
    
        // Update shader time uniform
        shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
    
        // Get audio data and update shader uniforms
        let data = analyser.getFrequencyData();
        shaderMaterial.uniforms.uAmplitudeBass.value = data[10] / 256;
        shaderMaterial.uniforms.uAmplitudeMid.value = data[100] / 256;
        shaderMaterial.uniforms.uAmplitudeTreble.value = data[180] / 256;
    
        // Animate particles based on audio data
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i + 1] = (Math.sin(clock.getElapsedTime() * 2 + positions[i]) * (data[50] / 256)) * 5;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    
        // Render the scene with post-processing
        composer.render();
    }
    
    animate();
    
    requestAnimationFrame(animate);

    // Update shader time uniform
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();

    // Get audio data and update shader uniforms
    let data = analyser.getFrequencyData();
    shaderMaterial.uniforms.uAmplitudeBass.value = data[10] / 256;
    shaderMaterial.uniforms.uAmplitudeMid.value = data[100] / 256;
    shaderMaterial.uniforms.uAmplitudeTreble.value = data[180] / 256;

    // Animate particles based on audio data
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i + 1] = (Math.sin(clock.getElapsedTime() * 2 + positions[i]) * (data[50] / 256)) * 5;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Render the scene with post-processing
    composer.render();
}

animate();
