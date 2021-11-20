/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Global definitions & gamePlay controller.
 */

var app = {


  options: {
    shadow: true,
    threejsGui: false,
    /** If you activate this then remove comment from line
     * // stats.update();    in cannon.engine.js
     */
    stats: false,
    text2dColor: "gold",
    text2dBalanceValue: 1000,
    text2dValueType: "$"
  },

  matShema: null,
  memoryFont2d: null,
  textMeshBalance: null,
  camera: null,
  camera2: null,

  scene: null,
  renderer: null,
  playerBody: null,
  projector: null,

  materials: {},

  audios: null,

  container: {
    wheelShapes: [],
    balls: [],
    boxes: []
  },

  updater: {
    wheelMeshes: [],
    ballMeshes: [],
    boxMeshes: [],
  },

  GLTFLoader : null,

  groupGamesIndicators: null,
  raycaster: null,
  INTERSECTED: null,
  opacityForHoveredField: 0.35,
  mouse: new THREE.Vector2(),

  groupControlsIndicators: null,
  INTERSECTED_BTN: null,

  centerRoll: null,
  spinSpeedDelta: 0,
  spinSpeedD : 0.05,
  getWheelSpinSpeed: function() {

    this.spinSpeedDelta += this.spinSpeedD;
    this.spinSpeedD = this.spinSpeedD - 0.000005;

    if (app.spinSpeedD < -0.01) {
      this.spinSpeedDelta = 0;
    }

    return this.spinSpeedDelta;

  },

  textContainer: new THREE.Group(),

  gamePlay: {

    waitingForNextSpin: 12000,
    spining: false, // dont edit
    memoChips: [], // dont edit
    currentBetValue: 1, // 1 2 5 10 20 50 100
    currentWinningNumber: -1,
    last20Numbers : [], // dont edit
    currentBets: betMapCurrentBets.constructAll()

  }

};

var sphereShape, sphereBody, world, physicsMaterial;
var camera, scene, renderer;
// var geometry, material, mesh;

// Fake controls.enabled
window.controls = {
  enabled: false
};

window.time = Date.now();

window.onload = function() {

  app.audios = this.audioSys;
  app.audios.init();

  if (isMobile()) {
    window.addEventListener("touchstart", app.audios.initBufferAudios, true);
  } else {
    window.addEventListener("click", app.audios.initBufferAudios, true);
  }

  app.projector = new THREE.Projector();
  app.raycaster = new THREE.Raycaster();

  var demo = new CANNON.Demo();
  app.engine = demo;
  // Remove at production
  window.demo = demo;

  /**
   * Control program flow.
   */

  setTimeout(function() {

    window.world = demo.getWorld();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    app.GLTFLoader = new THREE.GLTFLoader();
    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( "./scripts/libs/loaders/draco/" );
    dracoLoader.setDecoderConfig({type: "js"});
    app.GLTFLoader.setDRACOLoader( dracoLoader );

    var solver = new CANNON.GSSolver();
    solver.iterations = 7;
    solver.tolerance = 0.1;
    world.solver = new CANNON.SplitSolver(solver);
    world.gravity.set(0,-20,0);
    world.broadphase = new CANNON.NaiveBroadphase();

    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
      physicsMaterial,
      0.0, // friction coefficient
      0.3  // restitution
    );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Global materials
    // Cubemap
    var path = "assets/wheel-roll/metal-separators/";
    var format = ".jpg";
    var urls = [
      path + "reflection-wheel" + format, path + "reflection-wheel" + format,
      path + "reflection-wheel" + format, path + "reflection-wheel" + format,
      path + "reflection-wheel" + format, path + "reflection-wheel" + format
    ];

    app.materials.reflectionCube = new THREE.CubeTextureLoader().load( urls );

    app.materials.mapWood =  tex("./assets/wheel-roll/center/wood.jpg");

    app.materials.mapWoodX10 =  tex("./assets/wheel-roll/center/wood.jpg");
    app.materials.mapWoodX10.repeat.set(10, 10);
    app.materials.mapWoodX10.wrapS = THREE.RepeatWrapping;
    app.materials.mapWoodX10.wrapT = THREE.RepeatWrapping;

    app.materials.bigWheelMat = tex("./assets/wheel-roll/skin/skin.jpg");
    app.materials.bigWheelMat.repeat.set(4, 4);
    app.materials.bigWheelMat.wrapS = THREE.RepeatWrapping;
    app.materials.bigWheelMat.wrapT = THREE.RepeatWrapping;

    initGround();
    app.wheelRoll = initWheelRoll(world);
    initWheel();
    initBall();

    initRouletteTable();
    initRayCastIndicators();
    initLight();
    loadCredits();
    initTableFeet();

    setTimeout(function() {
      document.getElementById("loader").style.display = "none";
    }, 4000);

  }, 1);

};

