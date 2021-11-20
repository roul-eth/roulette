/* eslint-disable no-unused-vars */

/* globals CANNON THREE GROUP2 app controls
           world scene audioSys removeAllChips*/

var shootDirection = new THREE.Vector3(1, 0, 0.96);
var ballExist = false;
var ballBody = null, ballMesh = null;

// eslint-disable-next-line no-unused-vars
function initBall() {

  var ballShape = new CANNON.Sphere(.1);
  var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
  var shootVelo = 15.0;

  // window.addEventListener("click", shootBall, false);

  // eslint-disable-next-line no-unused-vars
  function shootFromPLayer(e) {

    if (controls.enabled == true) {

      // collect position info
      var x = app.playerBody.position.x;
      var y = app.playerBody.position.y;
      var z = app.playerBody.position.z;

      // Create cannon object.
      var ballBody = new CANNON.Body({
        mass: 1,
        linearDamping: 0,
        collisionFilterMask: GROUP2,
      });
      ballBody.addShape(ballShape);
      ballBody.linearDamping = 0;
      world.addBody(ballBody);

      // Three.js mesh
      // eslint-disable-next-line no-undef
      var ballMesh = new THREE.Mesh(ballGeometry, material);
      scene.add(ballMesh);
      ballMesh.castShadow = true;
      ballMesh.receiveShadow = true;

      app.container.balls.push(ballBody);
      app.updater.ballMeshes.push(ballMesh);

      setTimeout(function() {

        for(var i = 0; i < app.container.balls.length;i++) {

          if (app.container.balls[i] === ballBody) {
            world.remove( app.container.balls[i]);
            app.container.balls.splice(i, 1);
          }

        }

        // eslint-disable-next-line no-redeclare
        for(var i = 0;i < app.updater.ballMeshes.length;i++) {

          if ( app.updater.ballMeshes[i] === ballMesh) {
            scene.remove(app.updater.ballMeshes[i]);
            app.updater.ballMeshes.splice(i, 1);
          }

        }

      } , 10000);

      // getShootDir(shootDirection);

      shootDirection = new CANNON.Vec3(0,6,0);

      ballBody.velocity.set(
        shootDirection.x * shootVelo,
        shootDirection.y * shootVelo,
        shootDirection.z * shootVelo);

      // Move the ball outside the player sphere
      x += shootDirection.x * (app.playerBody.radius*1.02 + ballShape.radius);
      y += shootDirection.y * (app.playerBody.radius*1.02 + ballShape.radius);
      z += shootDirection.z * (app.playerBody.radius*1.02 + ballShape.radius);
      ballBody.position.set(x,y,z);
      ballMesh.position.set(x,y,z);
    }

  }

  function onSpiningEndAudio() {

    // console.log("Audio end event!");
    // Make loop while ball is in the move
    this.currentTime = 4;
    this.play();

  }

  app.onSpiningEndAudio = onSpiningEndAudio;

  // eslint-disable-next-line no-unused-vars
  function shootBall() {

    if (controls.enabled == true &&
       ballExist == false) {

      app.gamePlay.spining = true;
      ballExist = true;
      audioSys.spiningAudio.play();
      audioSys.spiningAudio.addEventListener("ended", onSpiningEndAudio, true);
      app.spinSpeedD = 0.05;

      var x = -5;
      var y = 8.3;
      var z = 3.5;

      // Create cannon object.
      ballBody = new CANNON.Body({
        mass: 1,
        linearDamping: 0,
        position: new CANNON.Vec3(x, y, z)
      });
      ballBody.addShape(ballShape);
      world.addBody(ballBody);

      // Three.js mesh
      ballMesh = new THREE.Mesh(ballGeometry, new THREE.MeshPhongMaterial({
        color: "white",
        specular: 0x050505,
        shininess: 10
      }));
      scene.add(ballMesh);
      ballMesh.castShadow = true;
      ballMesh.receiveShadow = true;

      app.container.balls.push(ballBody);
      app.updater.ballMeshes.push(ballMesh);

      // shootDirection.set(1, 0.5, 0);
      ballBody.velocity.set(
        shootDirection.x * shootVelo,
        shootDirection.y * shootVelo,
        shootDirection.z * shootVelo
      );

    } else {
      console.warn("Prevented ball shoot...");
    }

    /*
    // helper
    var geometry3 = new THREE.TorusGeometry(0.3, 0.3, 4, 4);
    // var material = new THREE.MeshBasicMaterial({ color: 0x34555f });
    var wheelMaterial3 = new THREE.MeshPhongMaterial({shininess: 10});
    wheelMaterial3.color.setHSL(1, 0, .5);  // red
    wheelMaterial3.flatShading = true;
    var torusMesh3 = new THREE.Mesh(geometry3, wheelMaterial3);
    torusMesh3.position.set(x, y, z);
    scene.add(torusMesh3);
    */

  }

  app.shootBall = shootBall;

}

function removeBall() {

  setTimeout(function() {

    for(var i = 0;i < app.container.balls.length;i++) {

      if (app.container.balls[i] === ballBody) {
        world.remove(app.container.balls[i]);
        app.container.balls.splice(i, 1);
      }

    }

    // eslint-disable-next-line no-redeclare
    for(var i = 0;i < app.updater.ballMeshes.length;i++) {

      if ( app.updater.ballMeshes[i] === ballMesh) {
        scene.remove(app.updater.ballMeshes[i]);
        app.updater.ballMeshes.splice(i, 1);
      }

    }

    removeAllChips(false);

    // End of spinnig status
    app.gamePlay.spining = false;
    ballExist = false;

  } , app.gamePlay.waitingForNextSpin);

}

