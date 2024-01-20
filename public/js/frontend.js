const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io()

const scoreEl = document.querySelector('#scoreEl')
const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2


//const player = new Player(x, y, 10, 'white')
const frontEndplayers = {}

//update된 플레이어 정보를 받음 Player에다가 저장시킴
socket.on('updatePlayers', (backEndPlayers)=>{
  for (const id in backEndPlayers){
    const backEndPlayer = backEndPlayers[id]
  
    if(!frontEndplayers[id]){
      frontEndplayers[id] = new Player({
        x: backEndPlayer.x,
        y: backEndPlayer.y,
        radius: 10,
        color: backEndPlayer.color
      })
    } else{ //이미 플레이어가 존재하면
      frontEndplayers[id].x = backEndPlayer.x
      frontEndplayers[id].y = backEndPlayer.y
    }

  }
  for (const id in frontEndplayers){ //players에는 있는데 서버에서 보낸 backendPlayers에는 없으면 삭제
    if(!backEndPlayers[id]){ 
      delete frontEndplayers[id]
    }
  }
})

let animationId

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (const id in frontEndplayers){
    const frontEndplayer = frontEndplayers[id]
    frontEndplayer.draw()
  }

}

animate()

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
}
const SPEED = 10
const playerInputs = []
const sequenceNumber = 0
setInterval(()=>{
  if(keys.w.pressed){
    sequenceNumber++
    playerInputs.push({sequenceNumber: sequenceNumber})
    frontEndplayers[socket.id].y -= SPEED
    socket.emit('keydown', 'KeyW')
  }
  if(keys.a.pressed){
    frontEndplayers[socket.id].x -= SPEED
    socket.emit('keydown', 'KeyA')
  }
  if(keys.s.pressed){
    frontEndplayers[socket.id].y += SPEED
    socket.emit('keydown', 'KeyS')
  }
  if(keys.d.pressed){
    frontEndplayers[socket.id].x += SPEED
    socket.emit('keydown', 'KeyD')
  }
})

window.addEventListener('keydown', (event)=>{
  switch(event.code){
    case 'KeyW':
      keys.w.pressed = true
      break
    case 'KeyA':
      keys.a.pressed = true
      break
    case 'KeyS':
      keys.s.pressed = true
      break
    case 'KeyD':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (event)=>{
  switch(event.code){
    case 'KeyW':
      keys.w.pressed = false
      break
    case 'KeyA':
      keys.a.pressed = false
      break
    case 'KeyS':
      keys.s.pressed = false
      break
    case 'KeyD':
      keys.d.pressed = false
      break
  }
})