// Scene setup
let scene, camera, renderer, controls;
let model, mixer;
let clock = new THREE.Clock();

// Camera settings
let isFirstPerson = true;
let cameraOffset = new THREE.Vector3(0, 5, -10); // Third person offset
const CAMERA_HEIGHT = 1.7; // First person eye height

// Movement settings
const moveSpeed = 0.1;
const sprintMultiplier = 2;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

// Player position
let playerPosition = new THREE.Vector3(0, CAMERA_HEIGHT, 5);

// Key states
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
    space: false,
    c: false,
    shift: false
};

// Mouse control
let isPointerLocked = false;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 0, 100);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.copy(playerPosition);

    // Create renderer with performance optimizations
    const canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: false, // Disabled for performance
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false; // Disabled shadows for performance

    // Minimal Lighting Setup for Maximum Performance
    // Strong ambient light - main illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Single directional light (no shadows)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(20, 25, 15);
    scene.add(directionalLight);

    // Hemisphere light for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.3);
    scene.add(hemisphereLight);

    // Add ground plane (reduced size for performance)
    const groundGeometry = new THREE.PlaneGeometry(50, 50); // Reduced from 100x100
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a4a4a,
        roughness: 0.9,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0; // At ground level
    scene.add(ground);

    // Grid removed to prevent z-fighting

    // Load 3D model
    loadModel();

    // Event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    // Mouse rotation disabled - only arrow keys for rotation
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

// Load the 3D model
function loadModel() {
    const loader = new THREE.GLTFLoader();
    
    // Try to load model.glb first, then model.gltf
    loader.load(
        'model.glb',
        function (gltf) {
            model = gltf.scene;
            model.position.set(0, 0.05, 0); // Slightly above ground to prevent z-fighting
            
            // Optimize materials for performance
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = false; // Disabled for performance
                    node.receiveShadow = false; // Disabled for performance
                    // Fix z-fighting on overlapping surfaces
                    if (node.material) {
                        node.material.flatShading = false;
                        // Enable polygon offset to fix z-fighting in model
                        node.material.polygonOffset = true;
                        node.material.polygonOffsetFactor = 1;
                        node.material.polygonOffsetUnits = 1;
                        node.material.depthTest = true;
                        node.material.depthWrite = true;
                    }
                }
            });

            // Setup animation mixer if animations exist
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }

            scene.add(model);
            console.log('Model loaded successfully!');
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading model:', error);
            console.log('Trying to load model.gltf instead...');
            
            // Try alternative format
            loader.load('model.gltf', 
                function(gltf) {
                    model = gltf.scene;
                    model.position.set(0, 0.05, 0); // Slightly above ground to prevent z-fighting
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = false;
                            node.receiveShadow = false;
                        }
                    });
                    scene.add(model);
                    console.log('Model loaded successfully!');
                },
                undefined,
                function(err) {
                    console.error('Could not load model. Please export your Blender file to model.glb or model.gltf');
                    // Create a placeholder cube
                    createPlaceholder();
                }
            );
        }
    );
}

// Create placeholder if model is not found
function createPlaceholder() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 1, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    console.log('Placeholder cube created. Please export your model as model.glb');
}

// Setup pointer lock controls
function setupPointerLock() {
    const canvas = document.getElementById('canvas');
    
    canvas.addEventListener('click', () => {
        if (isFirstPerson) {
            canvas.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === canvas;
    });
}

// Handle keyboard input
function onKeyDown(event) {
    const key = event.key.toLowerCase();
    const code = event.code;
    
    // Handle special keys by code
    if (code === 'Space') {
        keys.space = true;
        event.preventDefault(); // Prevent page scroll
    } else if (code === 'ShiftLeft' || code === 'ShiftRight') {
        keys.shift = true;
    } else if (code === 'ArrowUp') {
        keys.arrowup = true;
    } else if (code === 'ArrowDown') {
        keys.arrowdown = true;
    } else if (code === 'ArrowLeft') {
        keys.arrowleft = true;
    } else if (code === 'ArrowRight') {
        keys.arrowright = true;
    } else if (key in keys) {
        keys[key] = true;
    }
    
    // Toggle camera view with 'V' key
    if (key === 'v') {
        toggleView();
    }
}

function onKeyUp(event) {
    const key = event.key.toLowerCase();
    const code = event.code;
    
    // Handle special keys by code
    if (code === 'Space') {
        keys.space = false;
    } else if (code === 'ShiftLeft' || code === 'ShiftRight') {
        keys.shift = false;
    } else if (code === 'ArrowUp') {
        keys.arrowup = false;
    } else if (code === 'ArrowDown') {
        keys.arrowdown = false;
    } else if (code === 'ArrowLeft') {
        keys.arrowleft = false;
    } else if (code === 'ArrowRight') {
        keys.arrowright = false;
    } else if (key in keys) {
        keys[key] = false;
    }
}

// Handle mouse movement (DISABLED - Arrow keys only)
function onMouseMove(event) {
    // Mouse rotation disabled - use arrow keys instead
    return;
}

// Toggle between first and third person view
function toggleView() {
    isFirstPerson = !isFirstPerson;
    const viewModeElement = document.getElementById('view-mode');
    
    if (isFirstPerson) {
        viewModeElement.textContent = 'View: First Person';
    } else {
        viewModeElement.textContent = 'View: Third Person';
    }
}

// Update player movement
function updateMovement() {
    const delta = clock.getDelta();
    
    // Handle arrow key camera rotation
    const rotationSpeed = 0.05;
    if (keys.arrowleft) {
        euler.y += rotationSpeed;
        camera.quaternion.setFromEuler(euler);
    }
    if (keys.arrowright) {
        euler.y -= rotationSpeed;
        camera.quaternion.setFromEuler(euler);
    }
    if (keys.arrowup) {
        euler.x = Math.min(PI_2, euler.x + rotationSpeed);
        camera.quaternion.setFromEuler(euler);
    }
    if (keys.arrowdown) {
        euler.x = Math.max(-PI_2, euler.x - rotationSpeed);
        camera.quaternion.setFromEuler(euler);
    }
    
    // Calculate movement direction
    direction.set(0, 0, 0);
    
    if (keys.w) direction.z -= 1;
    if (keys.s) direction.z += 1;
    if (keys.a) direction.x -= 1;
    if (keys.d) direction.x += 1;
    
    // Normalize diagonal movement
    if (direction.length() > 0) {
        direction.normalize();
    }
    
    // Apply camera rotation to movement direction
    const rotation = new THREE.Euler(0, euler.y, 0);
    direction.applyEuler(rotation);
    
    // Calculate speed with sprint
    const speed = moveSpeed * (keys.shift ? sprintMultiplier : 1);
    
    // Update position
    velocity.x = direction.x * speed;
    velocity.z = direction.z * speed;
    velocity.y = 0;
    
    if (keys.space) velocity.y = speed;
    if (keys.c) velocity.y = -speed;
    
    playerPosition.add(velocity);
    
    // Update camera based on view mode
    if (isFirstPerson) {
        camera.position.copy(playerPosition);
    } else {
        // Third person - camera follows behind
        const offset = new THREE.Vector3(0, 5, 10);
        offset.applyEuler(rotation);
        camera.position.copy(playerPosition).add(offset);
        camera.lookAt(playerPosition);
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update movement
    updateMovement();
    
    // Update animations
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    // Render scene
    renderer.render(scene, camera);
}

// Start the application
init();
