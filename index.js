const canvas = document.querySelector('canvas') // Získání elementu plátna z DOMu.
const c = canvas.getContext('2d') // Získání 2D kontextu plátna.

canvas.width = 1024 // Nastavení šířky plátna.
canvas.height = 576 // Nastavení výšky plátna.

const scaledCanvas = {
  width: canvas.width / 4, // Vypočítání šířky zmenšeného plátna.
  height: canvas.height / 4, // Vypočítání výšky zmenšeného plátna.
}

const floorCollisions2D = [] // Inicializace pole pro ukládání 2D datových bloků kolizí.
for (let i = 0; i < floorCollisions.length; i += 36) { // Cyklus pro rozdělení dat kolizí do 2D pole.
  floorCollisions2D.push(floorCollisions.slice(i, i + 36)) // Přidání řádku kolizních dat do 2D pole.
}

const collisionBlocks = [] // Inicializace pole pro ukládání bloků kolizí.

// Procházení 2D pole kolizních dat.
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) { // Podmínka pro detekci kolizních bloků.
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16, // Přepočítání souřadnice x na souřadnici pixelů.
            y: y * 16, // Přepočítání souřadnice y na souřadnici pixelů.
          },
        })
      )
    }
  })
})

const platformCollisions2D = [] // Inicializace pole pro ukládání 2D datových bloků kolizí platform.
for (let i = 0; i < platformCollisions.length; i += 36) { // Cyklus pro rozdělení dat kolizí platform do 2D pole.
  platformCollisions2D.push(platformCollisions.slice(i, i + 36)) // Přidání řádku kolizních dat platformy do 2D pole.
}

const platformCollisionBlocks = [] // Inicializace pole pro ukládání bloků kolizí platform.

// Procházení 2D pole kolizních dat platform.
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) { // Podmínka pro detekci kolizních bloků platformy.
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16, // Přepočítání souřadnice x na souřadnici pixelů.
            y: y * 16, // Přepočítání souřadnice y na souřadnici pixelů.
          },
          height: 4, // Nastavení výšky bloku kolize.
        })
      )
    }
  })
})

const gravity = 0.1 // Nastavení hodnoty gravitace.

const player = new Player({ // Vytvoření instance hráče.
  position: {
    x: 100, // Počáteční souřadnice x hráče.
    y: 300, // Počáteční souřadnice y hráče.
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: './img/warrior/Idle.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: './img/warrior/Run.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: './img/warrior/Jump.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: './img/warrior/Fall.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: './img/warrior/FallLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: './img/warrior/RunLeft.png',
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: './img/warrior/IdleLeft.png',
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: './img/warrior/JumpLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
  },
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
})

const backgroundImageHeight = 432

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.scale(4, 4)
  c.translate(camera.position.x, camera.position.y)
  background.update()
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update()
  // })

  // platformCollisionBlocks.forEach((block) => {
  //   block.update()
  // })

  player.checkForHorizontalCanvasCollision()
  player.update()

  player.velocity.x = 0
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 2
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -2
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  c.restore()
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
      player.velocity.y = -4
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
})
/*
// Simulovaná databáze uživatelů
const userDatabase = [];

// Třída reprezentující uživatele
class User {
  constructor(username, password, characterLives) {
    this.username = username;
    this.password = password;
    this.characterLives = characterLives;
  }

  // Metoda pro snížení životů postavy
  decreaseCharacterLives() {
    if (this.characterLives > 0) {
      this.characterLives--;
    }
  }
}

// Funkce pro registraci nového uživatele
function registerUser(username, password) {
  const newUser = new User(username, password, 3); // Nový uživatel s 3 životy
  userDatabase.push(newUser);
  console.log(`Uživatel ${username} byl úspěšně zaregistrován.`);
}

// Funkce pro přihlášení uživatele
function loginUser(username, password) {
  const user = userDatabase.find((u) => u.username === username && u.password === password);
  if (user) {
    console.log(`Uživatel ${username} byl úspěšně přihlášen.`);
    return user;
  } else {
    console.log('Přihlášení selhalo. Zkontrolujte jméno a heslo.');
    return null;
  }
}

// Funkce pro aktualizaci životů hráče při pádu
function handlePlayerFall(player) {
  if (player.position.y > canvas.height) {
    // Hráč spadl mimo obrazovku
    const loggedInUser = userDatabase.find((user) => user.username === 'Hrac1'); // Předpokládáme jednoho hráče pro demonstrační účely

    if (loggedInUser) {
      loggedInUser.decreaseCharacterLives();
      console.log(`Zbývající životy hráče: ${loggedInUser.characterLives}`);
    }
  }
}

// Příklad použití
registerUser('Hrac1', 'Heslo123');
const loggedInUser = loginUser('Hrac1', 'Heslo123');

if (loggedInUser) {
  // Příklad snížení životů postavy při pádu
  loggedInUser.decreaseCharacterLives();
  console.log(`Zbývající životy postavy: ${loggedInUser.characterLives}`);
}

// ... (Ostatní kód pro animaci, ovládání hráče, atd.)

function animate() {
  window.requestAnimationFrame(animate);

  // ... (Zbytek animačního kódu zůstává nezměněn)

  // Zavolej funkci pro zpracování pádu hráče
  handlePlayerFall(player);

  // ... (Zbytek animačního kódu zůstává nezměněn)
}

animate();
*/
