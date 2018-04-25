// TO DO:
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

  static createAlien(){
    return new this(type, color, startingX, startingY, width=40, height=40, lives=1)
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

  shoot(){
    let enemyType = this.constructor.types.find(x => x!= this.type)
    this.bullets.push(new Bullet(this.posX + (this.width/2), this.posY, enemyType))
  }
}

Player.types = ['alien', 'human']

class Alien extends Player {
  static spawn(startingX, edgeX, startingY, numEnemiesPer, numLines) {
    return [...Array(numEnemiesPer * numLines).keys()].map(i => {
      let lineNum = Math.floor(i / numEnemiesPer)
      let position = i % numEnemiesPer
      let translateX = lineNum % 2 === 0 ? 80 : 0
      let translateY = lineNum * 80
      return new this('alien', 'white',
        edgeX * 0.8 * (position/numEnemiesPer) + startingX + translateX,
        startingY + translateY)
      }
    )
  }

  die() {
    let aliens = this.constructor.all
    aliens.splice(aliens.indexOf(this), 1)
  }
}

class Bullet {
  constructor(startingX, startingY, effectiveAgainst){
    this.posX = startingX
    this.posY = startingY
    this.effectiveAgainst = effectiveAgainst
    this.usedUp = false
  }

  atEdge(posY, fieldTop, fieldBottom) {
    return posY < fieldTop || posY > fieldBottom
  }

  move(spacesOver, fieldTop, fieldBottom) {
    let newPosY = this.posY + spacesOver
    if (this.atEdge(newPosY, fieldTop, fieldBottom)) {
      this.usedUp = true
    } else {
      this.posY = newPosY
    }
  }

  checkIfSuccessfulMaim(otherObjects) {
    return otherObjects.find(player => this.effectiveAgainst === player.type
      && (this.posX > player.posX && this.posX < player.posX + player.width)
      && this.posY === player.posY + player.height
    )
  }

  kill(player) {
    player.die()
    this.usedUp = true
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

  let deadAliens = 0

  Alien.all = Alien.spawn(canvasEdgeMin, canvasEdgeMax, canvasTop, numEnemies, numEnemyLines)

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
        human.shoot(Player.types)
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
      if(Alien.all.find(alien => alien.atEdge)) { alienMove = 0 - alienMove }
      Alien.all.forEach(alien => alien.move(alienMove, canvasEdgeMin, canvasEdgeMax))
    }
    Alien.all.forEach(alien => drawPlayer({...alien}))
    frame++

    // move, draw bullets
    for (i=0; i<human.bullets.length; i++){
      bullet = human.bullets[i]
      bullet.move(-5, canvasTop, canvasBottom)
      drawBullet({...bullet})
      alienCasualty = bullet.checkIfSuccessfulMaim(Alien.all)
      if(alienCasualty) {
        bullet.kill(alienCasualty)
        deadAliens++
        document.getElementById('scoreboard').innerHTML = `Kills: ${deadAliens}`
      }
      if(bullet.usedUp) {human.bullets.splice(i,1)}
    }
	}

	return {
		animate: draw,
    human: human,
    deadAliens: deadAliens
	}
})()

field = Field
field.animate()
