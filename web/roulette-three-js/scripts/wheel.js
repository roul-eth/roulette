
/* globals CANNON THREE app world scene */

/**
 * method initWheel()
 * Implement geometry from code,
 * used two torus object.
 */

// eslint-disable-next-line no-unused-vars
function initWheel() {

  /**
   * Torus 1
   */
  var positionTop = {
    torus1: -0.7,
    torus2: 1,
    torus3: 9
  };

  positionTop.torus1 += 6;
  positionTop.torus2 += 6;

  var wheelsPoly = 32;
  var wheelsPoly2 = 64;

  var sphereBodyWheel = new CANNON.Body({
    mass: 1,
    //collisionFilterGroup: GROUP1,
    //collisionFilterMask: GROUP2,
    type: CANNON.Body.STATIC,
    shape:  CANNON.Trimesh.createTorus(6.4, 2.5, wheelsPoly, wheelsPoly),
    position: new CANNON.Vec3(0, positionTop.torus1, 0)
  });

  sphereBodyWheel.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  world.addBody(sphereBodyWheel);
  window.sphereBodyWheel = sphereBodyWheel;

  var geometry = new THREE.TorusGeometry(6.4, 2.5, wheelsPoly, wheelsPoly);
  var wheelMatMap = app.materials.mapWoodX10;

  var wheelMaterial = new THREE.MeshPhongMaterial({
    color: "gold",
    map: wheelMatMap,
    shininess: 350,
    specular: 0x050505,
  });

  window.wheelMaterial = wheelMaterial;
  wheelMaterial.flatShading = false;

  var torusMesh = new THREE.Mesh(geometry, wheelMaterial);
  scene.add(torusMesh);

  app.container.balls.push(sphereBodyWheel);
  app.updater.ballMeshes.push(torusMesh);

  /**
   * Torus 2
   */

  var sphereBodyWheel2 = new CANNON.Body({
    mass: 1,
    type: CANNON.Body.STATIC,
    shape: CANNON.Trimesh.createTorus(8, 2, wheelsPoly2, wheelsPoly2),
    position: new CANNON.Vec3(0, positionTop.torus2, 0),
  });

  sphereBodyWheel2.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);

  world.addBody(sphereBodyWheel2);

  var geometry2 = new THREE.TorusGeometry(8, 2, wheelsPoly2, wheelsPoly2);

  var wheelMaterial2 = new THREE.MeshPhongMaterial({
    map: app.materials.bigWheelMat,
    color: getComputedStyle,
    //shininess: 55,
    // specular: "silver",
  });
  wheelMaterial2.color.setHSL(1, 0, .5);  // red
  wheelMaterial2.flatShading = false;

  var torusMesh2 = new THREE.Mesh(geometry2, wheelMaterial2);
  scene.add(torusMesh2);

  app.container.balls.push(sphereBodyWheel2);
  app.updater.ballMeshes.push(torusMesh2);

  /**
   * Torus 3
   * Golden ring 1 - Decoration
   */

  var sphereBodyWheel3 = new CANNON.Body({
    mass: 1,
    type: CANNON.Body.STATIC,
    shape: CANNON.Trimesh.createTorus(8, 0.2, wheelsPoly2, wheelsPoly2),
    position: new CANNON.Vec3(0, positionTop.torus3, 0),
  });

  sphereBodyWheel3.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);

  world.addBody(sphereBodyWheel3);

  var geometry3 = new THREE.TorusGeometry(8, 0.2, wheelsPoly2, wheelsPoly2);
  // var material = new THREE.MeshBasicMaterial({ color: 0x34555f });
  // var material = new THREE.MeshPhongMaterial({shininess: 1});
  var wheelMaterial3 = new THREE.MeshPhongMaterial({
    envMap: app.materials.reflectionCube,
    shininess: 10
  });
  // wheelMaterial3.color.setHSL(1, 0, .5);  // red
  wheelMaterial3.flatShading = false;

  var torusMesh3 = new THREE.Mesh(geometry3, wheelMaterial3);
  scene.add(torusMesh3);

  app.container.balls.push(sphereBodyWheel3);
  app.updater.ballMeshes.push(torusMesh3);

  /**
   * Torus 4
   * Golden ring 2
   */

  var sphereBodyWheel4 = new CANNON.Body({
    mass: 1,
    type: CANNON.Body.STATIC,
    shape: CANNON.Trimesh.createTorus(10.3, 0.5, wheelsPoly2, wheelsPoly2),
    position: new CANNON.Vec3(0, 7, 0),
  });

  sphereBodyWheel4.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
  world.addBody(sphereBodyWheel4);

  var geometry4 = new THREE.TorusGeometry(10.3, 0.5, wheelsPoly2, wheelsPoly2);

  var wheelMaterial4 = new THREE.MeshPhongMaterial({
    envMap: app.materials.reflectionCube,
    shininess: 10,
    color: "white"
  });
  wheelMaterial4.flatShading = false;

  var torusMesh4 = new THREE.Mesh(geometry4, wheelMaterial4);
  scene.add(torusMesh4);

  app.container.balls.push(sphereBodyWheel4);
  app.updater.ballMeshes.push(torusMesh4);

}
