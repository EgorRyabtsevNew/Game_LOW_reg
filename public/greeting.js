document.addEventListener('DOMContentLoaded', function() {
  const storedUsername = localStorage.getItem('username');

  if (storedUsername) {
    const greetingElement = document.getElementById('username-greeting');
    greetingElement.textContent = 'Hello, ' + storedUsername;
  }

  var mapContainer = document.getElementById('map-container');
  var navElement = document.querySelector('.medieval-nav');

  var navHeight = navElement.offsetHeight;
  var mapHeight = window.innerHeight - navHeight;
  var mapWidth = navElement.offsetWidth;

  var stage = new Konva.Stage({
    container: mapContainer,
    width: mapWidth,
    height: mapHeight
  });

  var layer = new Konva.Layer();

  var numColumns = Math.floor(mapWidth / navHeight);
  var numRows = Math.floor(mapHeight / navHeight);
  var squareSize = Math.min(mapWidth / numColumns, mapHeight / numRows);

  for (var i = 0; i < numColumns; i++) {
    for (var j = 0; j < numRows; j++) {
      var square = new Konva.Rect({
        x: i * squareSize,
        y: j * squareSize,
        width: squareSize,
        height: squareSize,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 1
      });

      layer.add(square);
    }
  }

  stage.add(layer);
});
