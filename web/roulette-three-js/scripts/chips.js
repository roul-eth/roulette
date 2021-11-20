
/* eslint-disable no-unused-vars */
/* globals CANNON world THREE demo decBalance
           tex scene app camera */

// eslint-disable-next-line no-unused-vars
function addChip(chipPosition, name) {

  if (app.gamePlay.spining === true) {
    return;
  }

  app.audios.chipStackAudio.play();
  var scaleFactor = 0.055;
  var localPath = "assets/complex/chip" + app.gamePlay.currentBetValue + ".gltf";

  app.GLTFLoader.load(localPath, function(gltf) {

    // console.log("Loaded chip ->" + gltf);
    var map =  tex("./assets/complex/chips-128/chip" + app.gamePlay.currentBetValue + ".png");

    gltf.scene.myValue = app.gamePlay.currentBetValue;
    gltf.scene.isWinChip = false;
    gltf.scene.betID = name;

    gltf.scene.position.y = 12;
    gltf.scene.scale.set(scaleFactor, scaleFactor *2 , scaleFactor);

    gltf.scene.children.forEach(function(item) {

      if (item.type === "Group") {

        item.children.forEach(function(subitem, i) {
          if (subitem.type === "Group") {
            // console.log("Group detected: ", i);
          }
        });

      } else {

        item.material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: map,
          // specular: 0xffffff,
          // shininess: 1
        });

      }

    });

    // gltf.scene.children[0].name = "i-am-chip";
    scene.add(gltf.scene);
    gltf.animations;  // Array<THREE.AnimationClip>
    gltf.scene;       // THREE.Group
    gltf.scenes;      // Array<THREE.Group>
    gltf.cameras;     // Array<THREE.Camera>
    gltf.asset;       // Object

    var s1 = 0.5;
    var s2 = 0.07;
    var s3 = 0.5;

    var mass = 1;
    var body = new CANNON.Body({
      mass: mass,
      position: chipPosition,
    });

    var shape = new CANNON.Box(new CANNON.Vec3(0.5*s1, s2, 0.5*s3));
    // var locRot = new CANNON.Quaternion(0,0,0,0);
    // body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 32);
    body.addShape(shape);
    world.addBody(body);

    map = tex("./assets/complex/chips-128/chip1.png");

    var material = new THREE.MeshPhongMaterial( {
      color: 0x996633,
      map: map,
      specular: 0x050505,
      shininess: 1
    });

    demo.addVisual(body, material, gltf.scene);

    /**
     * Fill data object,
     * identity chip bet stack.
     */

    if (name.indexOf("bet-number-") !== -1) {
      var idLocal = name.replace("bet-number-", "");
      console.log("Player bets on single number ---> ", idLocal);
      app.gamePlay.currentBets.numbers["num" + idLocal] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-quart-") !== -1) {
      var idLocal2 = name.replace("bet-quart-", "");
      console.log("Player bets on quart field ---> ", idLocal2);
      app.gamePlay.currentBets.quater["index" + idLocal2] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-split-") !== -1) {
      var idLocal3 = name.replace("bet-split-", "");
      console.log("Player bets on split field ---> ", idLocal3);
      app.gamePlay.currentBets.split["index" + idLocal3] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-street-") !== -1) {
      var idLocal4 = name.replace("bet-street-", "");
      console.log("Player bets on street field ---> ", idLocal4);
      app.gamePlay.currentBets.street["index" + idLocal4] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-line-") !== -1) {
      var idLocal5 = name.replace("bet-line-", "");
      console.log("Player bets on line field ---> ", idLocal5);
      app.gamePlay.currentBets.line["index" + idLocal5] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-red-") !== -1) {
      app.gamePlay.currentBets.color["red"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-black-") !== -1) {
      app.gamePlay.currentBets.color["black"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-game12-") !== -1) {
      var idLocalgame12 = name.replace("bet-game12-", "");
      app.gamePlay.currentBets.game12["index" + idLocalgame12] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-odd-") !== -1) {
      app.gamePlay.currentBets.oddEven["odd"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-even-") !== -1) {
      app.gamePlay.currentBets.oddEven["even"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-low-") !== -1) {
      app.gamePlay.currentBets.lowHigh["low"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-high-") !== -1) {
      app.gamePlay.currentBets.lowHigh["high"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-2to1-1") !== -1) {
      app.gamePlay.currentBets.twoToOne["index1"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-2to1-2") !== -1) {
      app.gamePlay.currentBets.twoToOne["index2"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-2to1-3") !== -1) {
      app.gamePlay.currentBets.twoToOne["index3"] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-trio-") !== -1) {
      var idLocalgame13 = name.replace("bet-trio-", "");
      app.gamePlay.currentBets.trio["index" + idLocalgame13] += app.gamePlay.currentBetValue;
      decBalance();
    } else if (name.indexOf("bet-basket-") !== -1) {
      app.gamePlay.currentBets.basket["index1"] += app.gamePlay.currentBetValue;
      decBalance();
    }

    // Extra games
    else if (name.indexOf("bet-zero-extra-") !== -1) {
      // app.gamePlay.currentBets.basket["index1"] += app.gamePlay.currentBetValue;
    }
    else if (name.indexOf("bet-serie023-extra-") !== -1) {
      // app.gamePlay.currentBets.basket["index1"] += app.gamePlay.currentBetValue;
    }
    else if (name.indexOf("bet-orfanela-extra-") !== -1) {
      // app.gamePlay.currentBets.basket["index1"] += app.gamePlay.currentBetValue;
    }
    else if (name.indexOf("bet-serie5-8-extra-") !== -1) {
      // app.gamePlay.currentBets.basket["index1"] += app.gamePlay.currentBetValue;
    }

  }, function(xhr) {
    // console.log((xhr.loaded / xhr.total * 100) + "% loaded");
  }, function(error) {
    console.log("An error happened", error);
  });

}
