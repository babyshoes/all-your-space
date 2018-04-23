// TO DO:
// - move animation

class Player {
  constructor(type, color, startingX, startingY, width=40, height=40, lives=1) {
    this.type = type
    this.color = color
    this.lives = lives
    this.width = width
    this.height = height
    this.posX = startingX
    this.posY = startingY
    this.atEdge = false
  }

  atRightEdge(posX, fieldEdgeRight) {
    let rightSpillOver = posX > fieldEdgeRight - this.width
    return rightSpillOver
  }

  atLeftEdge(posX, fieldEdgeLeft) {
    let leftSpillOver = posX < fieldEdgeLeft
    return leftSpillOver
  }

  move(spacesOver, fieldEdgeLeft, fieldEdgeRight) {
    let newPosX = this.posX + spacesOver
    let rightSpillOver = this.atRightEdge(newPosX, fieldEdgeRight)
    let leftSpillOver = this.atLeftEdge(newPosX, fieldEdgeLeft)
    newPosX = rightSpillOver ? fieldEdgeRight - this.width : newPosX
    newPosX = leftSpillOver ? fieldEdgeLeft : newPosX
    this.atEdge = rightSpillOver || leftSpillOver

    this.posX = newPosX
    this.atEdge = this.atLeftEdge(this.posX + spacesOver, fieldEdgeLeft) ||
                  this.atRightEdge(this.posX + spacesOver, fieldEdgeRight)
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
  var frame = 0

  var numEnemies = 5
  var numEnemyLines = 3
  var playerMove = 0
  var alienMove = 20

  function makeAliens(startingX, startingY) {
    return [...Array(numEnemies).keys()].map(i =>
      new Player('alien', 'white',
      canvasEdgeMax * 0.8 * (i/numEnemies) + canvasEdgeMin + startingX,
      canvasTop + startingY))
  }

  var enemyLines = [...Array(numEnemyLines).keys()]
    .reduce((lines, i) => {
      let startingX = i % 2 === 0 ? 70 : 0
      let startingY = i * 70
      return [...lines, makeAliens(startingX, startingY)]
    },
  [])

  // var aliens = [...Array(numEnemies).keys()].map(i =>
  //   new Player('alien', 'white', canvasEdgeMax * 0.8 * (i/numEnemies) + canvasEdgeMin, canvasTop ))
  var human = new Player('human', 'white', (canvas.width) / 2, canvasBottom)

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



  var drawPlayer = ({type, color, posX, posY, width, height}) => {
    if (type === 'human') {
      ctx.fillStyle = color
      ctx.fillRect(posX, posY, width, height)
    }
    else {
      ctx.strokeStyle = color
      ctx.strokeRect(posX, posY, width, height)
    }

  }

	function draw() {
	  window.requestAnimationFrame(draw)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(frame % 20 === 0){
      if([].concat(...enemyLines).find(alien => alien.atEdge)) { alienMove = 0 - alienMove }
      for (let aliens of enemyLines) {
        aliens.forEach(alien => alien.move(alienMove, canvasEdgeMin, canvasEdgeMax))
      }
    }

    human.move(playerMove, canvasEdgeMin, canvasEdgeMax)
    drawPlayer({...human})
    enemyLines.forEach(aliens =>
      aliens.forEach(alien => drawPlayer({...alien}))
    )
    frame++
	}

	return {
		animate: draw,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    // aliens: aliens,
    human: human,
    fieldEdgeRight: canvasEdgeMax
	}
})()

field = Field
field.animate()
