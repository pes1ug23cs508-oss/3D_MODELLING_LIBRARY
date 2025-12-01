3D Model Viewer (First/Third Person)

A browser-based 3D Model Viewer built using **Three.js**.  
It supports first-person and third-person camera views, WASD movement, arrow-key rotation, and GLB/GLTF model loading.  
This viewer is suitable for architectural walkthroughs, character previews, and exploring 3D worlds exported from Blender.

---

 Features

- Load **GLB / GLTF** 3D models  
- **First-person** and **third-person** camera modes  
- Full **WASD** movement system  
- Sprint, fly **up/down**, rotate with arrow keys  
- Lightweight lighting optimized for performance  
- Automatic fallback model if loading fails  
- Compatible with all Blender-exported GLB files  

---

 Project Structure

project-folder/
│── index.html # Main UI & canvas container
│── styles.css # UI styling
│── app.js # Three.js scene + movement logic
│── model.glb # Primary 3D model
│── model.gltf # Optional fallback model
│── textures/ # Optional textures for GLTF

pgsql
Copy code

---

 How to Run the Project

Browsers cannot load GLB/GLTF using the `file://` method,  
so the project must be run using a local server.

 Method 1 — VS Code (Recommended)

1. Install **Live Server** extension  
2. Right-click `index.html`  
3. Select **Open with Live Server**

 Method 2 — Python Local Server

```sh
python -m http.server
Open in browser:

arduino
Copy code
http://localhost:8000
📦 Adding Your 3D Model
Place your Blender-exported file in the root folder and name it:

Copy code
model.glb
The viewer will automatically load it.

Supported Formats
.glb (recommended)

.gltf (fallback)

Best Blender Export Settings
In Blender:
File → Export → glTF 2.0 (.glb)

Recommended settings:
Format: Binary (.glb)
Mesh 
UVs ✔
Normals ✔
Materials ✔
Animations (optional)
Apply Modifiers ✔

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
← Arrow	Rotate Left
→ Arrow	Rotate Right
↑ Arrow	Look Up
↓ Arrow	Look Down

View Mode
Key	Action
V	Toggle First ↔ Third Person

 Feature Breakdown
Scene & Lighting
The viewer uses three fast, lightweight lights:
AmbientLight
DirectionalLight
HemisphereLight
Shadows are disabled to improve performance.
Player Movement System
WASD movement
Sprinting
Fly Up/Down (Space / C)
Arrow-key camera rotation
Smooth Euler-based rotation system
Camera Modes
First Person
Camera matches the player's head height:

js
Copy code
camera.position.copy(playerPosition);
Third Person
Camera follows the player from behind:

js
Copy code
camera.position.copy(playerPosition).add(offset);
🗂️ Model Loading Process
Loading order:
model.glb
model.gltf
Placeholder cube (if both fail)

Includes:
Material optimization
Polygon offset to reduce z-fighting

GLTF AnimationMixer support
 Performance Optimizations
Shadows disabled
Antialiasing off
Pixel ratio capped
Lightweight lighting
Reduced ground plane
Z-fighting correction
Model material optimization
Runs smoothly even on low-end hardware.

 Debugging Tips
If your model does not load:
Check browser console errors
Confirm the file is named model.glb
For GLTF, check texture paths
Export from Blender as Binary (.glb)
