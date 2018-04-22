// TO DO:
// - create clearer board
// - impose field boundaries
// - have invaders move together
// - move animation

class Player {
  constructor(color, startingX, startingY, width=40, height=40, lives=1) {
    this.color = color
    this.lives = lives
    this.width = width
    this.height = height
    this.posX = startingX
    this.posY = startingY
  }

  move(spacesOver, fieldEdgeLeft, fieldEdgeRight) {
    let newPosX = this.posX + spacesOver
    
    newPosX = newPosX >= fieldEdgeRight - this.width ? fieldEdgeRight - this.width : newPosX
    newPosX = newPosX < fieldEdgeLeft ? fieldEdgeLeft : newPosX
    this.posX = newPosX
  }

  shoot(){

  }
}

var Field = (function() {
	var canvas = document.getElementById('c')
	var ctx = canvas.getContext('2d')
  var canvasEdgeMax = canvas.width * 0.95
  var canvasEdgeMin = canvas.width * 0.05
  var canvasTop = canvas.height * 0.05
  var canvasBottom = canvas.height * 0.9

  var numEnemies = 7
  var playerMove = 0

  var aliens = [...Array(numEnemies).keys()].map(i =>
    new Player('red', canvasEdgeMax * (i/numEnemies) + canvasEdgeMin, canvasTop ))
  var human = new Player('white', (canvas.width) / 2, canvasBottom)

  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        playerMove = -8
        break;
      case "ArrowRight":
        playerMove = 8
        break;
      case ' ':
        break;
    }
  })

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

    human.move(playerMove, canvasEdgeMin, canvasEdgeMax)
    drawPlayer({...human})
    aliens.forEach(alien => drawPlayer({...alien}))
	}

	return {
		animate: draw,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    aliens: aliens,
    human: human,
    fieldEdgeRight: canvasEdgeMax
	}
})()

field = Field
field.animate()
