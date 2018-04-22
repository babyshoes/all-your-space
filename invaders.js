// TO DO:
// - create clearer board
// - impose field boundaries
// - have invaders move together
// - spawn animation

class Player {
  constructor(color, startingX, startingY, width=40, height=40, lives=1) {
    this.color = color
    this.lives = lives
    this.width = width
    this.height = height
    this.posX = startingX
    this.posY = startingY
  }

  move(spacesOver) {
    this.posX += spacesOver
  }

  shoot(){

  }
}

var Field = (function() {
	var canvas = document.getElementById('c')
	var ctx = canvas.getContext('2d')
  var playerMove = 0
  var numEnemies = 5

  var aliens = [...Array(numEnemies).keys()].map(i =>
    new Player('red', canvas.width * i/numEnemies, 10 ))
  var human = new Player('white', canvas.width / 2, 300)

  window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      playerMove = -8
      break;
    case "ArrowRight":
      playerMove = 8
      break;
    case ' ':
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
  // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true)

  window.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        playerMove = 0
        break;
      case "ArrowRight":
        playerMove = 0
        break;
    }
  })

  var drawPlayer = ({color, posX, posY, width, height}) => {
    ctx.fillStyle = color
    ctx.fillRect(posX, posY, width, height)
  }

	function draw() {
	  window.requestAnimationFrame(draw)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    human.move(playerMove)
    drawPlayer({...human})
    aliens.forEach(alien => drawPlayer({...alien}))
	}

	return {
		animate: draw,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height
	}
})()

field = Field
field.animate()
