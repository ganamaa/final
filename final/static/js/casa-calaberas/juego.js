var TECLA_ARRIBA    = 38,
    TECLA_ABAJO     = 40,
    TECLA_DERECHA   = 39,
    TECLA_IZQUIERDA = 37,
    CANVAS_WIDTH    = 1000,
    CANVAS_HEIGHT   = 600;
    
var monsterGraveyard = new Array();

// Crea el canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

// imagen de fondo
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "/static/img/img-caza-calaberas/fondo.jpg";

// imagen personaje
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "/static/img/img-caza-calaberas/abajoHeroe.png";

// imagen monstruo
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "/static/img/img-caza-calaberas/abajoEsqueleto.png";

// imagen lapida
var deadMonsterReady = false;
var deadMonsterImage = new Image();
deadMonsterImage.onload = function () {
    deadMonsterReady = true;
};
deadMonsterImage.src = "/static/img/img-caza-calaberas/lapida.png";

// objetos del juego
var hero = {
    velocidad: 256 
};
var monster = {
    velocidad: 5  
};
var monstersCaught = 0;

// controles
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// resetea el juego
var start = true;

var reset = function () {
    if (start){
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;
        start = false;
    }
    
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
    monster.velocidad = (monster.velocidad > 100 ) ? ( monster.velocidad) : (monster.velocidad + monstersCaught);
};


var update = function (modifier) {
    if (TECLA_ARRIBA in keysDown) { // Jugador hacia arriba
        hero.y = (hero.y > 0) ? (hero.y - hero.velocidad * modifier) : canvas.height - 32;
        monster.y = ( monster.y >0 ) ? ( monster.y - monster.velocidad * modifier ) : canvas.height - 32;
	heroImage.src = "/static/img/img-caza-calaberas/arribaHeroe.png";
	monsterImage.src = "/static/img/img-caza-calaberas/arribaEsqueleto.png";
    }

    if (TECLA_ABAJO in keysDown) { // Jugador hacia abajo
        hero.y = (hero.y + hero.velocidad * modifier) % canvas.height;
        monster.y = ( monster.y + monster.velocidad * modifier) % canvas.height;
	heroImage.src = "/static/img/img-caza-calaberas/abajoHeroe.png";
	monsterImage.src = "/static/img/img-caza-calaberas/abajoEsqueleto.png";
    }

    if (TECLA_IZQUIERDA in keysDown) { // Jugador hacia izquierda
        hero.x = (hero.x > 0) ? (hero.x - hero.velocidad * modifier) : canvas.width - 32;
        monster.x = (monster.x > 0) ? (monster.x - monster.velocidad * modifier) : canvas.width - 32;
	heroImage.src = "/static/img/img-caza-calaberas/izquierdaHeroe.png";
	monsterImage.src = "/static/img/img-caza-calaberas/izquierdaEsqueleto.png";
    }

    if (TECLA_DERECHA in keysDown) { // jugador hacia derecha
        hero.x = (hero.x + hero.velocidad * modifier) % canvas.width;
        monster.x = (monster.x +  monster.velocidad * modifier) % canvas.width;
	heroImage.src = "/static/img/img-caza-calaberas/derechaHeroe.png";
	monsterImage.src = "/static/img/img-caza-calaberas/derechaEsqueleto.png";
    }

   
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        monsterGraveyard.push({"x": monster.x, "y": monster.y });
        reset();   
    }
};



var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (deadMonsterReady) {
        for (deadMonster in monsterGraveyard) {
            ctx.drawImage(deadMonsterImage, monsterGraveyard[deadMonster].x ,monsterGraveyard[deadMonster].y)
        }
    }
    
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }


    // puntaje
    ctx.fillStyle = "rgb(254, 000, 000)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Esqueletos Cazados: " + monstersCaught, 32, 32);
};

// bucle
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};


reset();
var then = Date.now();
setInterval(main, 1); 