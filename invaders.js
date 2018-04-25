// TO DO:
// - shooting mechanic
// - killing mechanic
// - tally kill score
// - score div
// - rotating move animation


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
    this.bullets = []
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
    this.posX = newPosX

    this.atEdge = this.atLeftEdge(this.posX + spacesOver, fieldEdgeLeft) ||
                  this.atRightEdge(this.posX + spacesOver, fieldEdgeRight)
  }

  shoot(playerTypes){
    let enemyType = playerTypes.find(x => x!=this.type)
    this.bullets.push(new Bullet(this.posX + (this.width/2), this.posY, enemyType))
  }
}

class Bullet {
  constructor(startingX, startingY, effectiveAgainst){
    this.posX = startingX
    this.posY = startingY
    this.effectiveAgainst = effectiveAgainst
  }

  move(spacesOver, fieldTop, fieldBottom) {
    let newPosY = this.posY + spacesOver
  }
}

const Field = (function() {
	const canvas = document.getElementById('c')
	const ctx = canvas.getContext('2d')
  const canvasEdgeMax = canvas.width * 0.95
  const canvasEdgeMin = canvas.width * 0.05
  const canvasTop = canvas.height * 0.05
  const canvasBottom = canvas.height * 0.9

  const numEnemies = 5
  const numEnemyLines = 3
  let playerMove = 0
  let alienMove = 20
  let frame = 0

  const playerTypes = ['alien', 'human']

  function makeAliens(startingX, startingY) {
    return [...Array(numEnemies).keys()].map(i =>
      new Player('alien', 'white',
      canvasEdgeMax * 0.8 * (i/numEnemies) + canvasEdgeMin + startingX,
      canvasTop + startingY))
  }

  let enemyLines = [...Array(numEnemyLines).keys()]
    .reduce((lines, i) => {
      let startingX = i % 2 === 0 ? 80 : 0
      let startingY = i * 80
      return [...lines, makeAliens(startingX, startingY)]
    },
  [])

  const human = new Player('human', 'white', (canvas.width) / 2, canvasBottom)

  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
        playerMove = -8
        break;
      case "ArrowRight":
        playerMove = 8
        break;
      case ' ':
        human.shoot(playerTypes)
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


  const drawPlayer = ({type, color, posX, posY, width, height}) => {
    ctx.beginPath();
    ctx.rect(posX, posY, width, height);
    if (type.includes('human')) {
      ctx.fillStyle = color
      ctx.fill()
    }
    if (type.includes('alien')) {
      ctx.strokeStyle = color
      ctx.stroke()
    }
  }

  const drawBullet = ({posX, posY}) => {
    ctx.beginPath();
    ctx.arc(posX, posY, 3, 0, 2*Math.PI);
    ctx.strokeStyle = 'white'
    ctx.stroke();
  }

	function draw() {
	  window.requestAnimationFrame(draw)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // move, draw human player
    human.move(playerMove, canvasEdgeMin, canvasEdgeMax)
    drawPlayer({...human})

    // move, draw alien players
    if(frame % 20 === 0){
      if([].concat(...enemyLines).find(alien => alien.atEdge)) { alienMove = 0 - alienMove }
      for (let aliens of enemyLines) {
        aliens.forEach(alien => alien.move(alienMove, canvasEdgeMin, canvasEdgeMax))
      }
    }
    enemyLines.forEach(aliens =>
      aliens.forEach(alien => drawPlayer({...alien}))
    )
    frame++

    // draw bullet
    human.bullets.forEach(bullet => drawBullet({...bullet}))
	}

	return {
		animate: draw,
    human: human,
    enemyLines: enemyLines
	}
})()

field = Field
field.animate()
