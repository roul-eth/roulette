
/* eslint-disable no-unused-vars */
/* globals  GROUP1 GROUP2 GROUP3 CANNON demo world onSpiningEndAudio
            audioSys scene THREE app tex initCenterRoll setWinningNumber */

var TOTAL_Y = 1.3;

function initWheelRoll(world) {

  var s1 = 1;
  var s2 = .35;
  var s3 = .15;

  var mass = 10;
  var body = new CANNON.Body({
    mass: mass,
    position: new CANNON.Vec3(0, TOTAL_Y, 0),
    type: CANNON.Body.STATIC,
  });
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 32);

  var shape = new CANNON.Box(new CANNON.Vec3(0.5*s1, 0.5*s2, 0.5*s3));

  for (var i=0;i < 37;i++) {

    var help = { x: 3, y: 3, z: 0 };
    // eslint-disable-next-line no-undef
    help = orbit(0, 0, i / 5.905, help);
    var x = help.x;
    var y = 10;
    var z = help.y;

    var locRot = null;

    if (i == 0) {
      locRot = new CANNON.Quaternion(0,0,0,0);
      locRot.setFromAxisAngle(new CANNON.Vec3(0,1,0), -90 * Math.PI / 360);
    } else {
      var local = -i / 5.95 - 90 * Math.PI/360;
      locRot = new CANNON.Quaternion(0, 0, 0, 0);
      locRot.setFromAxisAngle(new CANNON.Vec3(0,1,0), local);
    }

    body.addShape(shape, new CANNON.Vec3( x, 6, z), locRot);

  }

  world.addBody(body);

  /*
    var refractionCube = new THREE.CubeTextureLoader().load( urls );
    refractionCube.mapping = THREE.CubeRefractionMapping;
    var cubeMaterial2 = new THREE.MeshLambertMaterial({
      color: 0xffee00,
      envMap: refractionCube,
      refractionRatio: 0.95
    });
  */

  var material = new THREE.MeshPhongMaterial( {
    color: 0x996633,
    envMap: app.materials.reflectionCube,
    specular: 0x050505,
    shininess: 100
  } );
  demo.addVisual(body, material);

  body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 5.23 * Math.PI / 32);
  app.wheelRoll2 = initWheelRollS();
  initWheelRing();

  return body;
}

function initWheelRollS() {

  var s1 = 1;
  var s2 = .15;
  var s3 = .72;

  var mass = 5;
  var body = new CANNON.Body({
    mass: mass,
    position: new CANNON.Vec3(0,TOTAL_Y - 0.3, 0),
    type: CANNON.Body.STATIC,
  });

  body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 32);

  for (var i=0;i < 37;i++) {

    var shape = new CANNON.Box(new CANNON.Vec3(0.5*s1, 0.5*s2, 0.5*s3));

    var help = { x: 3, y: 3, z: 0 };
    // eslint-disable-next-line no-undef
    help = orbit(0, 0, i / 5.89, help);
    var x = help.x;
    var y = 10;
    var z = help.y;
    var startUpAngle = -90;
    var locRot = null;

    if (i == 0) {
      locRot = new CANNON.Quaternion(0,0,0,0);
      locRot.setFromAxisAngle(new CANNON.Vec3(0,1,0), (startUpAngle) * Math.PI / 360);
    } else {
      var local = -i / 5.85 + startUpAngle * Math.PI/360;
      locRot = new CANNON.Quaternion(0, 0, 0, 0);
      locRot.setFromAxisAngle(new CANNON.Vec3(0,1,0), local);
    }

    shape.wheelnum = i + 1;
    body.addShape(shape, new CANNON.Vec3( x, 6, z), locRot);

  }

  world.addBody(body);

  var materials = [];
  var matShema = [
    0, 32, 15, 19, 4, 21, 2,
    25, 17, 34, 6, 27, 13, 36,
    11, 30, 8, 23, 10, 5, 24,
    16, 33, 1, 20, 14, 31, 9, 22,
    18, 29, 7, 28, 12, 35, 3, 26];

  app.matShema = matShema;

  for (var j=0;j < 37;j++) {

    materials.push(new THREE.MeshPhongMaterial( {
      color: 0xffffff,
      map: tex("assets/wheel-roll/numbers-128/" + matShema[j] + ".png"),
      // specular: 0xffffff,
      shininess: 200
    }));

  }

  body.addEventListener("collide", function(e) {

    var relativeVelocity = e.contact.getImpactVelocityAlongNormal();

    if(Math.abs(relativeVelocity) > 10) {

      // console.log("Collider test ...");

    } else {

      // Possible trouble if on some old browser audio doesnt work!
      if (audioSys.spiningAudio.paused === true) {
        return;
      }

      var winNum = e.contact.sj.wheelnum;
      if (winNum > -1 && winNum < 38) {

        // Decode winNumber
        winNum = app.matShema[winNum - 1];

        // Audio staff
        audioSys.spiningAudio.currentTime = 0;
        audioSys.spiningAudio.removeEventListener("ended", app.onSpiningEndAudio, true);
        audioSys.spiningAudio.pause();
        audioSys.spiningEndAudio.play();

        // Data staff
        app.gamePlay.currentWinningNumber = winNum;
        app.gamePlay.last20Numbers.push(winNum);

        console.info("Current wining number is: ", winNum);

        setWinningNumber(winNum);
        // console.log(" CURRENT " ,app.spinSpeedDelta , " , " , app.spinSpeedD);
        // app.spinSpeedDelta = 0;
        // app.spinSpeedD = 0.02;

      }
      console.log("Ball touch down e -> ", e);
    }
  });

  demo.addVisual(body, materials);
  return body;

}

function initWheelRing() {

  /**
   * Torus 3
   */

  var wheelsPoly2 = 32;

  var sphereBodyWheel3 = new CANNON.Body({
    mass: 1,
    type: CANNON.Body.STATIC,
    shape: CANNON.Trimesh.createTorus(3.7, 0.2, wheelsPoly2, wheelsPoly2),
    position: new CANNON.Vec3(0, TOTAL_Y + 5.92, 0),
  });

  sphereBodyWheel3.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);

  world.addBody(sphereBodyWheel3);

  var geometry3 = new THREE.TorusGeometry(3.7, 0.2, wheelsPoly2, wheelsPoly2);
  // var material = new THREE.MeshBasicMaterial({ color: 0x34555f });
  // var material = new THREE.MeshPhongMaterial({shininess: 1});
  var wheelMaterial3 = new THREE.MeshPhongMaterial( {
    color: 0xffffff,
    map: tex("assets/wheel-roll/metal/2.jpg"),
    specular: 0xffffff,
    shininess: 120
  });

  wheelMaterial3.color.setHSL(1, 0, .5);  // red
  wheelMaterial3.flatShading = false;

  var torusMesh3 = new THREE.Mesh(geometry3, wheelMaterial3);
  scene.add(torusMesh3);

  app.container.balls.push(sphereBodyWheel3);
  app.updater.ballMeshes.push(torusMesh3);

  initCenterRoll();

}
