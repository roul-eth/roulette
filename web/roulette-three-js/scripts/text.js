/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */

function decBalance() {

  app.options.text2dBalanceValue -= app.gamePlay.currentBetValue;
  updateBalance();

}

function loadCredits() {

  var loader = new THREE.FontLoader();

  loader.load( "assets/fonts/helvetiker_regular.typeface.json", function(font) {

    app.memoryFont2d = font;

    var xMid;
    var color = new THREE.Color(app.options.text2dColor);

    var matDark = new THREE.MeshBasicMaterial( {
      color: color,
      side: THREE.DoubleSide
    } );

    var matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });

    var message = "Credits:\n " + app.options.text2dBalanceValue + " " + app.options.text2dValueType;

    var shapes = font.generateShapes(message, 1);
    var geometry = new THREE.ShapeBufferGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    // make shape ( N.B. edge view not visible )
    app.textMeshBalance = new THREE.Mesh( geometry, matLite );
    app.textMeshBalance.position.x = -15;
    app.textMeshBalance.position.z = -45;
    app.textMeshBalance.position.y = 6.35;
    app.textMeshBalance.rotateY(-Math.PI / 2);
    app.textMeshBalance.rotateX(-Math.PI / 2);
    scene.add(app.textMeshBalance);
    // make line shape ( N.B. edge view remains visible )
    var holeShapes = [];

    for ( var i = 0; i < shapes.length; i ++ ) {
      var shape = shapes[ i ];
      if (shape.holes && shape.holes.length > 0) {
        for (var j = 0;j < shape.holes.length;j++) {
          var hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }

    shapes.push.apply( shapes, holeShapes );

  });

}

function updateBalance() {

  var message = "Credits:\n " + app.options.text2dBalanceValue + " " + app.options.text2dValueType;
  var shapes = app.memoryFont2d.generateShapes(message, 1);
  var geometry = new THREE.ShapeBufferGeometry(shapes);

  geometry.computeBoundingBox();
  var xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  geometry.translate(xMid, 0, 0);

  app.textMeshBalance.geometry = geometry;

}
