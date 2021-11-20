
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* globals CANNON world THREE demo tex scene app camera
           betMapCurrentBets addChip updateBalance removeBall */

// eslint-disable-next-line no-unused-vars
function initRouletteTable() {

  // texture part - table number bet places
  var s1 = 35;
  var s2 = 0.2;
  var s3 = 35;

  var mass = 10;
  var body = new CANNON.Body({
    mass: mass,
    // collisionFilterGroup: GROUP1,
    // collisionFilterMask: GROUP2 | GROUP3,
    position: new CANNON.Vec3(0, 6, -31.4),
    type: CANNON.Body.STATIC,
  });

  var shape = new CANNON.Box(new CANNON.Vec3(0.5*s1, 0.5*s2, 0.5*s3));
  var locRot = new CANNON.Quaternion(0,0,0,0);
  // locRot.setFromAxisAngle(new CANNON.Vec3(1,0,0), 180 * Math.PI / 360);
  // body.addShape(shape, new CANNON.Vec3(0, 0, 0), locRot);
  body.addShape(shape);
  world.addBody(body);
  window.myRayCastGroundBody = body;

  var tableBetMap =  tex("./assets/table/table.png");
  var material = new THREE.MeshPhongMaterial( {
    color: "white",
    map: tableBetMap,
    // specular: 0xffffff,
    // shininess: 1000
  });

  demo.addVisual(body, material);

  // ----------------------------------------------
  // Just visual OBJECT THREEJS MeshBasicMaterial
  var tableBackgroundTex =  tex("./assets/table/tablebackground.png");
  tableBackgroundTex.repeat.set(3, 4);
  tableBackgroundTex.wrapS = THREE.RepeatWrapping;
  tableBackgroundTex.wrapT = THREE.RepeatWrapping;

  var bboxGeometry = new THREE.BoxGeometry(36, 1, 65);
  var bboxMaterial = new THREE.MeshPhongMaterial({
    color: "white",
    map: tableBackgroundTex
  });

  var test = new THREE.Mesh(bboxGeometry,bboxMaterial);
  test.position.set(0, 5.5, -17);

  scene.add(test);

  // replace with table bet
  return body.visualref;

}

function initRayCastIndicators() {

  /**
   * Games bet stacks.
   */

  // Numbers game stacks.
  app.groupGamesIndicators = null;
  var testGroup = new THREE.Group();
  var c = 0;
  var dimY = 0.05;

  // Zero single number
  var zeroGeometry = new THREE.BoxGeometry(6.3, dimY + 0.25, 1.5);
  var bboxMaterial = new THREE.MeshPhongMaterial({
    color: "red",
    opacity: 0
  });

  bboxMaterial.transparent = true;
  var zeroMesh = new THREE.Mesh(zeroGeometry,bboxMaterial);
  zeroMesh.name = "bet-number-" + c;
  c++;
  zeroMesh.position.set(-5.7, 6.15, -46);
  testGroup.add(zeroMesh);

  c = 1;
  for (var j = 0;j < 12; j++) {
    for (var k = 0;k < 3; k++) {
      var bboxGeometry = new THREE.BoxGeometry(1, dimY, 1);
      bboxMaterial = new THREE.MeshPhongMaterial({
        color: "purple",
        opacity: 0
      });

      bboxMaterial.transparent = true;
      var test = new THREE.Mesh(bboxGeometry,bboxMaterial);
      test.name = "bet-number-" + c;
      c++;
      test.position.set(-7.75 + k * 2.15, 6.24, -43.95 + j * 2.165);
      testGroup.add(test);
    }
  }

  // Quater
  c = 1;
  for (j = 0;j < 11; j++) {
    for (k = 0;k < 2; k++) {

      bboxMaterial = new THREE.MeshPhongMaterial({
        color: "blue",
        opacity: 0
      });

      bboxMaterial.transparent = true;

      var test2 = new THREE.Mesh(bboxGeometry,bboxMaterial);
      test2.name = "bet-quart-" + c;
      c++;
      test2.position.set(-6.75 + k * 2.15, 6.24, -42.8 + j * 2.165);
      testGroup.add(test2);
    }
  }

  // Semi
  c = 1;
  for (j = 0;j < 12; j++) {
    for (k = 0;k < 3; k++) {

      bboxMaterial = new THREE.MeshPhongMaterial({
        color: "orange",
        opacity: 0
      });

      bboxMaterial.transparent = true;

      var test3 = new THREE.Mesh(bboxGeometry,bboxMaterial);
      test3.name = "bet-split-" + c;
      c++;
      test3.position.set(-7.75 + k * 2.15, 6.24, -45 + j * 2.165);
      testGroup.add(test3);
    }
  }

  // Semi 2
  for (j = 0;j < 12; j++) {
    for (k = 0;k < 2; k++) {

      bboxMaterial = new THREE.MeshPhongMaterial({
        color: "orange",
        opacity: 0
      });

      bboxMaterial.transparent = true;

      var test4 = new THREE.Mesh(bboxGeometry,bboxMaterial);
      test4.name = "bet-split-" + c;
      c++;
      test4.position.set(-6.75 + k * 2.15, 6.24, -43.9 + j * 2.165);
      testGroup.add(test4);
    }
  }

  c = 1;
  // Street
  for (j = 0;j < 12; j++) {
    for (k = 0;k < 1; k++) {

      bboxMaterial = new THREE.MeshPhongMaterial({
        color: "red",
        opacity: 0
      });

      bboxMaterial.transparent = true;

      var test5 = new THREE.Mesh(bboxGeometry,bboxMaterial);
      test5.name = "bet-street-" + c;
      c++;
      test5.position.set(-8.75 + k * 2.15, 6.24, -43.9 + j * 2.165);
      testGroup.add(test5);
    }
  }

  c = 1;
  // Line
  for (j = 0;j < 11; j++) {
    for (k = 0;k < 1; k++) {

      bboxMaterial = new THREE.MeshPhongMaterial({
        color: "white",
        opacity: 0
      });

      bboxMaterial.transparent = true;

      var test6 = new THREE.Mesh(bboxGeometry,bboxMaterial);
      test6.name = "bet-line-" + c;
      c++;
      test6.position.set(-8.75 + k * 2.15, 6.24, -42.9 + j * 2.165);
      testGroup.add(test6);
    }
  }

  // first 12 games
  var bboxGeometryGame12 = new THREE.BoxGeometry(1.69, dimY, 8.6);

  c = 1;
  for (k = 0;k < 3; k++) {

    bboxMaterial = new THREE.MeshPhongMaterial({
      color: "blue",
      opacity: 0
    });

    bboxMaterial.transparent = true;

    var test7 = new THREE.Mesh(bboxGeometryGame12, bboxMaterial);
    test7.name = "bet-game12-" + c;
    c++;
    test7.position.set(-10.1, 6.24, -40.7 + k * 8.65);
    testGroup.add(test7);
  }

  // 1-18, 19-36, even/odd, red/black.
  var bboxGeometryGameBottom = new THREE.BoxGeometry(1.8, dimY, 4.25);

  for (k = 0;k < 6; k++) {

    bboxMaterial = new THREE.MeshPhongMaterial({
      color: "blue",
      opacity: 0
    });
    bboxMaterial.transparent = true;

    var test8 = new THREE.Mesh(bboxGeometryGameBottom, bboxMaterial);
    if (k == 0) {
      test8.name = "bet-low-";
    } else if (k == 1) {
      test8.name = "bet-even-";
    } else if (k == 2) {
      test8.name = "bet-red-";
    } else if (k == 3) {
      test8.name = "bet-black-";
    } else if (k == 4) {
      test8.name = "bet-odd-";
    } else if (k == 5) {
      test8.name = "bet-high-";
    }

    test8.position.set(-12, 6.24, -42.85 + k * 4.34);
    testGroup.add(test8);
  }

  c = 1;
  // 2to1
  for (var k = 0;k < 3; k++) {
    bboxGeometry = new THREE.BoxGeometry(2.125, dimY, 3);
    bboxMaterial = new THREE.MeshPhongMaterial({
      color: "purple",
      opacity: 0
    });

    bboxMaterial.transparent = true;
    test = new THREE.Mesh(bboxGeometry,bboxMaterial);
    test.name = "bet-2to1-" + c;
    c++;
    test.position.set(-7.85 + k * 2.15, 6.24, -17.3);
    testGroup.add(test);
  }

  // Basket
  bboxGeometry = new THREE.BoxGeometry(1, dimY, 1);
  var bboxMaterial = new THREE.MeshPhongMaterial({
    color: "red",
    opacity: 0
  });

  bboxMaterial.transparent = true;
  var trioMesh = new THREE.Mesh(bboxGeometry,bboxMaterial);
  trioMesh.name = "bet-trio-1";
  trioMesh.position.set(-6.7, 6.24, -45);
  testGroup.add(trioMesh);

  var trioMesh = new THREE.Mesh(bboxGeometry, new THREE.MeshPhongMaterial({
    color: "red",
    opacity: 0,
    transparent: true
  }));
  trioMesh.name = "bet-trio-2";
  trioMesh.position.set(-4.51, 6.24, -45);
  testGroup.add(trioMesh);

  var basketMesh = new THREE.Mesh(bboxGeometry, new THREE.MeshPhongMaterial({
    color: "red",
    opacity: 0,
    transparent: true
  }));
  basketMesh.name = "bet-basket-1";
  basketMesh.position.set(-8.75, 6.24, -45);
  testGroup.add(basketMesh);

  // Adding to the scene all.
  scene.add(testGroup);
  app.groupGamesIndicators = testGroup;

  // Extra games
  // ZERO
  var eZeroGeometry = new THREE.BoxGeometry(7.3, dimY, 4.2);
  var eZeroMaterial = new THREE.MeshPhongMaterial({
    color: "purple",
    opacity: 0,
    transparent: true
  });

  bboxMaterial.transparent = true;
  var test = new THREE.Mesh(eZeroGeometry, eZeroMaterial);
  test.name = "bet-zero-extra-";
  test.position.set(7.75, 6.24, -20);
  testGroup.add(test);

  // SERIE 023
  var eSerie023Geometry = new THREE.BoxGeometry(7.3, dimY, 8.35);
  var eSerie023Material = new THREE.MeshPhongMaterial({
    color: "purple",
    opacity: 0,
    transparent: true
  });

  var test = new THREE.Mesh(eSerie023Geometry, eSerie023Material);
  test.name = "bet-serie023-extra-";
  test.position.set(7.75, 6.24, -26.35);
  testGroup.add(test);

  // ORFANELA
  var sqLength = 6;

  var squareShape = new THREE.Shape()
    .moveTo( -0.91, 0.5 )
    .lineTo( -0.91, sqLength - 0.58)
    .lineTo( sqLength + 0.43, sqLength - 0.58 )
    .lineTo( sqLength + 0.43, -2.8 );
    //.lineTo( 1, 0 );
  var extrudeSettings = { depth: 0.4, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
  var geometry = new THREE.ExtrudeBufferGeometry( squareShape, extrudeSettings );

  var orfaMaterial = new THREE.MeshPhongMaterial({
    color: "purple",
    opacity: 0,
    transparent: true
  });

  var meshOrfanela = new THREE.Mesh(geometry, orfaMaterial);
  meshOrfanela.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), 180 * Math.PI / 360);
  meshOrfanela.name = "bet-orfanela-extra-";
  meshOrfanela.position.set( 5, 6.24, -36);
  testGroup.add(meshOrfanela);

  // Serie 5/8
  var squareShape2 = new THREE.Shape()
    .moveTo( -0.91, -3.4 )
    .lineTo( -0.91, sqLength - 0.38)
    .lineTo( sqLength + 0.43, sqLength - 0.38 )
    .lineTo( sqLength + 0.43, -0.1 );
    //.lineTo( 1, 0 );
  var extrudeSettings = { depth: 0.4, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
  var geometry = new THREE.ExtrudeBufferGeometry( squareShape2, extrudeSettings );

  var serie58Material = new THREE.MeshPhongMaterial({
    color: "purple",
    opacity: 0,
    transparent: true
  });

  var mesh58 = new THREE.Mesh(geometry, serie58Material);
  //mesh58.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -180 * Math.PI / 360);
  mesh58.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -180 * Math.PI / 360);
  window.mesh58 = mesh58;
  mesh58.name = "bet-serie5-8-extra-";
  mesh58.position.set( 5, 5.82, -39);
  testGroup.add(mesh58);

  /**
   * Controls Buttons
   * - Remove All Chips
   * - Spin
   */

  // RemoveAll chips btn
  var controlsBtnGroup = new THREE.Group();
  var btnGeometry = new THREE.BoxGeometry(2.5, 0.1, 3.5);
  var removeAllTex = tex("./assets/control-btns/remove-all.png");
  var runSpinTex = tex("./assets/control-btns/spin.png");

  var sideMaterial = new THREE.MeshPhongMaterial({
    color: "silver",
    specular: 0xffffff,
    shininess: 1
  });

  var removeAllMaterial = [sideMaterial, sideMaterial,
    new THREE.MeshBasicMaterial({
      map: removeAllTex,
      color: "white",
      transparent: true
    }),
    sideMaterial, sideMaterial, sideMaterial
  ];

  var local = new THREE.Mesh(btnGeometry, removeAllMaterial);
  local.name = "remove-all";
  local.position.set(-15.5, 6.5, -23);
  controlsBtnGroup.add(local);

  // Spin Btn
  var runSpinMaterial = [sideMaterial, sideMaterial,
    new THREE.MeshBasicMaterial({
      map: runSpinTex,
      color: "white",
      transparent: true,
    }),
    sideMaterial, sideMaterial, sideMaterial
  ];

  var local2 = new THREE.Mesh(btnGeometry, runSpinMaterial);
  local2.name = "run-spin";
  local2.position.set(-15.5, 6.5, -28);
  controlsBtnGroup.add(local2);

  scene.add(controlsBtnGroup);
  app.groupControlsIndicators = controlsBtnGroup;

  /**
   * Attaching general click 3d raycast feature.
   * - for bet stacks
   * - for control hud buttons
   *   (spin btn, remove all btn)
   */
  window.addEventListener("click", tableBetAction, false);
  window.addEventListener("click", tableRemoveAllBetsAction, false);

}

function addBySceneID(id) {

  addChip(new CANNON.Vec3(app.groupGamesIndicators.children[id].position.x , 7, app.groupGamesIndicators.children[id].position.z),
    app.groupGamesIndicators.children[id].name
  );

}

// Remove at production
// window.addBySceneID = addBySceneID;

function addGameExtra(intersects) {

  if (intersects[0].object.name.indexOf("bet-serie5-8-extra-") !== -1) {

    // Serial5|8
    // Split 33-30
    addBySceneID(91);
    // Split 33-36
    addBySceneID(94);
    // Split 27-30
    addBySceneID(88);
    // Split 24-27
    addBySceneID(85);
    // Split 23-24
    addBySceneID(110);
    // Split 10-13
    addBySceneID(71);
    // Split 8-11
    addBySceneID(69);
    // Split 10-11
    addBySceneID(101);
    // Split 5-8
    addBySceneID(66);
    // Split 13-16
    addBySceneID(74);

  } else if (intersects[0].object.name.indexOf("bet-orfanela-extra-") !== -1) {

    // Orfanela
    // Split 17-20
    addBySceneID(78);
    // Split 14-17
    addBySceneID(75);
    // Split 31-34
    addBySceneID(92);
    // Split 6-9
    addBySceneID(67);
    // Number 1
    addBySceneID(1);

  } else if (intersects[0].object.name.indexOf("bet-zero-extra-") !== -1) {

    // Zero
    // Split 32-35
    addBySceneID(93);
    // Split 12-15
    addBySceneID(73);
    // Number26
    addBySceneID(26);
    // Split 0-3
    addBySceneID(61);

  } else if (intersects[0].object.name.indexOf("bet-serie023-extra-") !== -1) {

    // serial023
    // Split 28-29
    addBySceneID(113);
    // Split 19-22
    addBySceneID(80);
    // SPlit 7-4
    addBySceneID(65);
    //Split 18-21
    addBySceneID(79);
    // Number 2
    addBySceneID(2);
    // Split 25-28
    addBySceneID(86);

  }

}

function tableBetAction(e) {
  // test
  camera.updateMatrixWorld();

  // find intersections
  app.raycaster.setFromCamera(app.mouse, app.camera);

  if (scene.children.length > 20) {
    var intersects = app.raycaster.intersectObjects(app.groupGamesIndicators.children);
    if (intersects.length > 0) {
      if (app.INTERSECTED == intersects[0].object) {

        // console.log(" BET ID --> " + intersects[0].object.name);

        if (intersects[0].object.name.indexOf("bet-serie5-8-extra-") !== -1 ||
            intersects[0].object.name.indexOf("bet-orfanela-extra-") !== -1 ||
            intersects[0].object.name.indexOf("bet-zero-extra-") !== -1 ||
            intersects[0].object.name.indexOf("bet-serie023-extra-") !== -1) {

          // Fix center pivot in next release.
          // eslint-disable-next-line no-undef
          addGameExtra(intersects);

        } else {

          // eslint-disable-next-line no-undef
          addChip(new CANNON.Vec3(intersects[0].object.position.x, 7, intersects[0].object.position.z),
            intersects[0].object.name
          );

        }
      }
    }
  }

}

function tableRemoveAllBetsAction(e) {

  camera.updateMatrixWorld();
  // find intersections
  app.raycaster.setFromCamera(app.mouse, app.camera);
  if (scene.children.length > 20 && app.groupControlsIndicators !== null) {
    var intersects = app.raycaster.intersectObjects(app.groupControlsIndicators.children);
    if (intersects.length > 0) {
      if (app.INTERSECTED_BTN == intersects[0].object) {

        if (intersects[0].object.name === "run-spin") {
          removeAllPhisicsChips();
          app.shootBall();
        } else if (intersects[0].object.name === "remove-all" &&
          app.gamePlay.spining === false) {
          removeAllChips(true);
        }
        // console.log(" REMOVE ALL BETS ID --> " + intersects[0].object.name);

      }
    }
  }

}

function removeAllChips(backToBalance) {

  app.audios.removeChipsAudio.play();

  while (app.gamePlay.memoChips.length !== 0) {

    app.gamePlay.memoChips.forEach(function(item) {
      if (item instanceof CANNON.Body) {
        // console.log("Chip removing: ", item);
        demo.removeVisual(item);
      } else {
        console.log("NOT INSTANCE OF BODY");
      }
    });

    // Remove threejs scene objects (chips)
    demo.scene.children.forEach(function(item) {
      if (item.type == "Group" && item.name == "Scene") {

        if (backToBalance == true) {
          // console.log(" back to balance ", item.myValue);
          app.options.text2dBalanceValue += item.myValue;
        }

        if (item.children[0].name == "Light" &&
            item.children[1].name == "Camera" &&
            item.children[2].name == "Circle") {

          demo.scene.remove(item);

        }

      }
    });

    if (backToBalance == true) {
      updateBalance();
    }

    app.gamePlay.memoChips.forEach(function(item, index, object) {
      object.splice(index, 1);
    });

    // Clear be-stack data
    for (var propertyGame in app.gamePlay.currentBets) {

      if (propertyGame.indexOf("Role") == -1) {
        for (var propertyField in app.gamePlay.currentBets[propertyGame]) {
          if (propertyField !== "quota") {
            app.gamePlay.currentBets[propertyGame][propertyField] = 0;
          }
        }
      }

    }

  }

}

function setWinningNumber(winNumber) {

  // Winning number
  console.log("CALL setWinningNumber method ", winNumber);

  // Mark winning number.
  app.groupGamesIndicators.children[winNumber].material.opacity = 1;

  setTimeout(function() {
    // Unmark winning number.
    app.groupGamesIndicators.children[winNumber].material.opacity = 0;
  }, 3000);

  // Clear visuals
  while(removeNoWinChips(winNumber) != 0) {
    // Clear all
  }

  removeBall();

  // Get Win value and preview
  var result = betMapCurrentBets.getWinningValue(winNumber);
  app.options.text2dBalanceValue += result;
  updateBalance();

}

function removeAllPhisicsChips() {

  if (app.gamePlay.memoChips.length !== 0) {

    app.gamePlay.memoChips.forEach(function(item) {
      if (item instanceof CANNON.Body) {
        // console.log("Chip removing: ", item);
        demo.removeVisual(item);
      } else {
        console.log("NOT INBSTANCE OF BODY");
      }
    });

  }

}

function initTableFeet() {

  var scaleFactor = 8;

  app.materials.tableFeet = tex("./assets/decorations/tablefeet.png");
  app.materials.tableFeet.repeat.set(24, 16);
  app.materials.tableFeet.wrapS = THREE.RepeatWrapping;
  app.materials.tableFeet.wrapT = THREE.RepeatWrapping;

  app.GLTFLoader.load("assets/decorations/table-feet.gltf",
    function(gltf) {

      // Possible fix from blender.
      if (gltf.scene.name === "Scene") {
        gltf.scene.name = "centerRoll";
      }

      // app.centerRoll = gltf.scene;
      // console.log("LOADED ->" + gltf);
      // window.gltf = gltf;

      gltf.scene.position.y = -1;
      gltf.scene.position.z = -17;
      gltf.scene.rotateY(Math.PI / 2);
      gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

      var local = 0;

      gltf.scene.children.forEach(function(item) {

        if (item.type === "Group") {
          console.log("mat detected 2: ");
          item.children.forEach(function(subitem, i) {
            if (subitem.type === "Group") {
              console.log("Group detected: ", i);
            }
          });
        } else {

          // console.log("mat detected table feet: ");

          if (local == 2) {

            item.material = new THREE.MeshPhongMaterial({
              color: "silver",
              map: app.materials.tableFeet,
              specular: "silver",
              shininess: 300
            });

          }

          local++;

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

function removeNoWinChips(winNum) {

  var localRemovedCount = 0;

  demo.scene.children.forEach(function(item) {
    if (item.type == "Group" && item.name == "Scene") {

      // console.log(" CHECK IT  ", item.betID);
      var isWiningStack = false;
      // More validate
      // if (item.children[0].name == "Light" && item.children[1].name == "Camera" && item.children[2].name == "Circle") {

      if (item.betID === "bet-number-" + winNum) {
        // var idLocal = item.betID.replace("bet-number-", "");
        // console.log("single number chip stack win place---> ", winNum);
        isWiningStack = true;

      } else if (item.betID.indexOf("bet-quart-") !== -1) {

        var idLocal2 = item.betID.replace("bet-quart-", "index");
        betMapCurrentBets.quaterRole[idLocal2].forEach(function(role) {
          if (role === winNum) {
            // console.log("Wins on quart field ---> ", idLocal2);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-split-") !== -1) {

        var idLocal3 = item.betID.replace("bet-split-", "index");
        // console.log("win split field ---> ", item.betID);

        betMapCurrentBets.semiRole[idLocal3].forEach(function(role) {
          if (role === winNum) {
            // console.log("Wins on quart field ---> ", idLocal3);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-street-") !== -1) {
        var idLocal4 = item.betID.replace("bet-street-", "index");

        betMapCurrentBets.streetRole[idLocal4].forEach(function(role) {
          if (role === winNum) {
            // console.log("win street field ---> ", idLocal4);
            isWiningStack = true;
          }
        });

        console.log("Player bets on street field ---> ", winNum);

      } else if (item.betID.indexOf("bet-line-") !== -1) {

        var idLocal5 = item.betID.replace("bet-line-", "index");
        // console.log("Player bets on line field ---> ", winNum);

        betMapCurrentBets.lineRole[idLocal5].forEach(function(role) {
          if (role === winNum) {
            // console.log("win line field ---> ", idLocal5);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-red-") !== -1) {

        betMapCurrentBets.colorsRole.reds.forEach(function(role) {
          if (role === winNum) {
            // console.log("win red field ---> ", item.betID, " and winNum is ", winNum);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-black-") !== -1) {

        betMapCurrentBets.colorsRole.blacks.forEach(function(role) {
          if (role === winNum) {
            // console.log("win black field ---> ", item.betID, " and winNum is ", winNum);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-game12-") !== -1) {

        var idLocalgame12 = item.betID.replace("bet-game12-", "");
        if (idLocalgame12 === "1" && winNum > 0 && winNum < 13) {
          // console.log("game12 1 field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        } else if (idLocalgame12 === "2" && winNum > 12 && winNum < 25) {
          // console.log("game12 2 field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        } else if (idLocalgame12 === "3" && winNum > 24 && winNum < 37) {
          // console.log("game12 3 field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        }

      } else if (item.betID.indexOf("bet-odd-") !== -1) {

        if (betMapCurrentBets.isOdd(winNum)) {
          // console.log("oddEven odd field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        }

      } else if (item.betID.indexOf("bet-even-") !== -1) {

        if (betMapCurrentBets.isEven(winNum)) {
          // console.log("oddEven even field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        }

      } else if (item.betID.indexOf("bet-low-") !== -1) {

        if (winNum > 0 && winNum < 19) {
          // console.log("LOW field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        }

      } else if (item.betID.indexOf("bet-high-") !== -1) {

        if (winNum > 18 && winNum < 37) {
          // console.log("HIGH field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        }

      } else if (item.betID.indexOf("bet-2to1-1") !== -1) {

        betMapCurrentBets.twoToOneRole.column1.forEach(function(localItem){
          if (localItem === winNum) {
            // console.log("2 to 1  1 field ---> ", item.betID, " and winNum is ", winNum);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-2to1-2") !== -1) {

        betMapCurrentBets.twoToOneRole.column2.forEach(function(localItem){
          if (localItem === winNum) {
            // console.log("2 to 1  2 field ---> ", item.betID, " and winNum is ", winNum);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-2to1-3") !== -1) {

        betMapCurrentBets.twoToOneRole.column3.forEach(function(localItem){
          if (localItem === winNum) {
            // console.log("2 to 1  3 field ---> ", item.betID, " and winNum is ", winNum);
            isWiningStack = true;
          }
        });

      } else if (item.betID.indexOf("bet-trio-") !== -1) {

        var idLocalgame13 = item.betID.replace("bet-trio-", "");
        if (idLocalgame13 === "1" && (winNum == 0 || winNum == 1 || winNum == 2) ) {

          // console.log("TRIO  1 field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;

        } else if (idLocalgame13 === "2" && (winNum == 0 || winNum == 2 || winNum == 3)) {

          // console.log("TRIO  2 field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;

        }

      } else if (item.betID.indexOf("bet-basket-1") !== -1) {

        if (winNum == 0 || winNum == 1 || winNum == 2 || winNum == 3) {
          // console.log("BASKET 1 field ---> ", item.betID, " and winNum is ", winNum);
          isWiningStack = true;
        }

      }

      if (isWiningStack == false) {
        // remove no winning chips
        demo.scene.remove(item);
        localRemovedCount++;
      }

    }

  });

  return localRemovedCount;

}
