
/* globals THREE scene app*/

// eslint-disable-next-line no-unused-vars
function initCenterRoll() {

  var scaleFactor = 19;
  var map = app.materials.mapWood;

  /*
    var loader = new THREE.GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( "./scripts/libs/loaders/draco/" );
    dracoLoader.setDecoderConfig({type: "js"});
    loader.setDRACOLoader( dracoLoader );
  */

  app.GLTFLoader.load("assets/wheel-roll/center/centerRoll.gltf",
    function(gltf) {

      // Possible fix from blender.
      if (gltf.scene.name === "Scene") {
        gltf.scene.name = "centerRoll";
      }

      app.centerRoll = gltf.scene;

      // console.log("LOADED ->" + gltf);
      window.gltf = gltf;
      gltf.scene.position.y = 7.9;
      gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

      gltf.scene.children.forEach(function(item) {

        if (item.type === "Group") {
          console.log("mat detected 2: ");
          item.children.forEach(function(subitem, i) {
            if (subitem.type === "Group") {
              console.log("Group detected: ", i);
            }
          });
        } else {

          // console.log("mat detected 1: ");
          item.material = new THREE.MeshPhongMaterial({ // THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: map, // optional environment map
            specular: 0xffffff,
            shininess: 100
          });

          // item.material.color.setHSL(0, 1, .5);  // red
          // item.material.flatShading = false;

        }

      });

      scene.add(gltf.scene);
      gltf.animations;  // Array<THREE.AnimationClip>
      gltf.scene;       // THREE.Group
      gltf.scenes;      // Array<THREE.Group>
      gltf.cameras;     // Array<THREE.Camera>
      gltf.asset;       // Object

    }, function(xhr) {
      // console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    }, function(error) {
      console.log("An error happened", error);
    });

}
