README.md — 3D Model Viewer (First/Third Person)
 Overview
This project is a browser-based 3D Model Viewer built using Three.js.
It supports:
•	 Loading GLB / GLTF 3D models
•	 First-person and third-person camera views
•	 Full movement system (WASD + Arrow keys)
•	 Sprint, up/down flying, camera rotation
•	 Basic lighting and performance-optimized rendering
•	 Works with any 3D model exported from Blender
This project is perfect for exploring architectural models, game characters, or any 3D world.

 Project Structure
project-folder/
│── index.html        # Main webpage UI  :contentReference[oaicite:0]{index=0}
│── styles.css        # UI styling & layout  :contentReference[oaicite:1]{index=1}
│── app.js            # Three.js scene + movement logic (your script)
│── model.glb         # Your 3D model (place inside this folder)
│── model.gltf        # Optional fallback model
│── textures/         # (Optional) Texture folder if GLTF uses external textures

 How to Run the Project
Because browsers block file loading, you MUST use a local server.
Method 1 — VS Code (Recommended)
1.	Install extension "Live Server"
2.	Right-click index.html
3.	Click “Open with Live Server”

Method 2 — Command Line (Python server)
For Python 3:
python -m http.server
Then open:
http://localhost:8000

 Adding Your 3D Model
Place your Blender-exported file into your project folder:
model.glb
Your app.js will automatically load it.
Supported formats
•	.glb (recommended)
•	.gltf (fallback)
✔️ Best export settings in Blender
File → Export → glTF 2.0 (.glb)
Choose:
•	Format: Binary (.glb)
•	Mesh: ✔️
•	UVs: ✔️
•	Normals: ✔️
•	Materials: ✔️
•	Animation: (only if needed)
•	Apply Modifiers: ✔️
•	

 Controls
Movement
Key	Action
W	Move Forward
S	Move Backward
A	Move Left
D	Move Right
Shift	Sprint
Space	Move Up
C	Move Down

Camera Rotation
Key	Action
Arrow Left	Rotate camera left
Arrow Right	Rotate camera right
Arrow Up	Look up
Arrow Down	Look down

View Mode
Key	Action
V	Toggle First ↔ Third Person

 Features Explained
 Scene + Lighting
Your scene uses three lightweight lights for performance:
•	AmbientLight
•	DirectionalLight
•	HemisphereLight
Shadows are disabled to boost FPS.

 Player Movement System
Your movement logic supports:
•	Normal movement
•	Sprinting
•	Flight (Space/C)
•	Smooth camera rotation
•	Euler-based rotation system
•	Pointer lock optional (mouse disabled for now)

 Camera Modes
1. First Person
Camera stays at player's head height:
camera.position.copy(playerPosition);
2. Third Person
Camera follows from behind:
camera.position.copy(playerPosition).add(offset);

 Model Loading Process
The app tries in order:
1.	model.glb
2.	model.gltf
3.	Placeholder cube (if both missing)
Includes:
•	Material optimization
•	Polygon offset to fix z-fighting
•	AnimationMixer support for GLTF animations

 Performance Optimization (Already Applied)
Your project includes:
•	No shadows
•	Antialias disabled
•	Pixel ratio capped
•	Low-overhead lighting
•	Reduced ground size
•	Z-fighting reduction on meshes
•	Model traversal for optimization
Runs smoothly even on low-end PCs.

 Debugging Tips
If model does not load:
✔ Check console → error message
✔ Ensure filename is model.glb
✔ Fix texture paths when using GLTF
✔ Export as Binary (.glb) for best compatibility

