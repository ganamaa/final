//Variables globales
var velocidad = 50;
var desplazamiento = 8;
var superficie = 267;
var nVirus = 600;
var bucle;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ancho = canvas.width;
var alto = canvas.height;
var modal = document.getElementById("modal");
var puntaje = document.getElementById("puntaje");
var numVirus = document.getElementById("numVirusSuperados");
var puntajeAux;
var numVirusAux;
var punMax = document.getElementById("puntMax");
var puntajeMax = 0;
var nivel;
var nivelJuego = document.getElementById("nivelJuego")
//Clases
class Objeto {
	constructor(){
		this.img = document.createElement("img");
	}
	choque(otro){
		if(this.fondo < otro.techo || this.techo > otro.fondo || this.derecha < otro.izquierda || this.izquierda > otro.derecha){
			return false;
		} else {
			return true;
		}
	}
}

class Mundo {
	constructor(){
		this.x = 0;
		this.y = superficie;
		this.tamano = 1000;
		this.espacio = 32;
		this.img = document.createElement("img");
		this.img.src = "/static/img/img-juego/mundo.png";
		this.imgNube = document.createElement("img");
		this.imgNube.src = "/static/img/img-juego/nube.png";
		this.nx = 350;
		this.ny = 50;
		this.nd = 250;
	}
	dibujar(){
		var tx = this.x;
		for(var i=0; i<=this.tamano;i++){
			ctx.drawImage(this.img, tx, this.y);
			tx+=this.espacio;
		}
	}
	mover(){
		this.x-=desplazamiento;
	}
}
class Corredor extends Objeto {
	constructor(){
		super();
		this.x = 35;
		this.w = 100;
		this.h = 116;
		this.y = superficie-this.h;
		this.img.src = "/static/img/img-juego/runner.png";

		this.techo = this.y;
		this.fondo = this.y+this.h-15;

		this.bordeDerecha = 30;
		this.bordeIzquierda = 50;
		this.derecha = this.x+this.w-this.bordeDerecha;
		this.izquierda = this.x+this.bordeIzquierda;

	}
	dibujar(){
		ctx.drawImage(this.img, this.x, this.y);
	}
	actualizarBordes(){
		this.techo = this.y;
		this.fondo = this.y+this.h+10;
	}
}

class Virus extends Objeto {
	constructor(x){
		super();
		this.x = x;
		this.hmin = 25;
		this.hmax = 40;
		this.h = this.generar(this.hmin, this.hmax);
		this.w = this.h*(0.58);
		this.y = superficie-this.h;
		this.nmin = 1;
		this.nmax = 3;
		this.n = this.generar(this.nmin, this.nmax);
		this.dmin = 250;
		this.dmax = 400;
		this.d = this.generar(this.dmin, this.dmax);
		this.siguiente = null;
		this.img.src = "/static/img/img-juego/virus.png";
		this.techo = this.y;
		this.fondo = this.y+this.h;
		this.derecha = this.x+this.w;
		this.izquierda = this.x;
	}
	dibujar(){
		var tx = this.x;
		for(var i=0;i<this.n;i++){
			ctx.drawImage(this.img, tx, this.y, this.w, this.h);
			tx+=this.w;
			this.derecha = tx;
		}
		if(this.siguiente != null){
			this.siguiente.dibujar();
		}
	}
	mover(){
		this.x-=desplazamiento;
		this.izquierda = this.x;
		if(this.siguiente != null){
			this.siguiente.mover();
		}
	}
	agregar(){
		if(this.siguiente == null){
			this.siguiente = new Virus(this.x+this.d);
		} else{
			this.siguiente.agregar();
		}
	}
	generar(a,b){
		return Math.floor((Math.random() * b) + a);
	}
	verSiguiente(){
		return this.siguiente;
	}
}

class Nubes extends Objeto {
	constructor(x){
		super();
		this.x = x;
		this.hmin = 25;
		this.hmax = 40;
		this.h = this.generar(this.hmin, this.hmax);
		this.w = this.h*(1.51);
		this.y = 50;
		this.nmin = 1;
		this.nmax = 3;
		this.n = this.generar(this.nmin, this.nmax);
		this.dmin = 250;
		this.dmax = 400;
		this.d = this.generar(this.dmin, this.dmax);
		this.siguiente = null;
		this.img.src = "/static/img/img-juego/nube.png";
		this.techo = this.y;
		this.fondo = this.y+this.h;
		this.derecha = this.x+this.w;
		this.izquierda = this.x;
	}
	dibujar(){
		var tx = this.x;
		for(var i=0;i<this.n;i++){
			ctx.drawImage(this.img, tx, this.y, this.w, this.h);
			tx+=this.w;
			this.derecha = tx;
		}
		if(this.siguiente != null){
			this.siguiente.dibujar();
		}
	}
	mover(){
		this.x-=2;
		this.izquierda = this.x;
		if(this.siguiente != null){
			this.siguiente.mover();
		}
	}
	agregar(){
		if(this.siguiente == null){
			this.siguiente = new Nubes(this.x+this.d);
		} else{
			this.siguiente.agregar();
		}
	}
	generar(a,b){
		return Math.floor((Math.random() * b) + a);
	}
	verSiguiente(){
		return this.siguiente;
	}
}
class Tiempo {
	constructor(){
		nivel = 0;
		this.tiempo = 0;
		this.limite = 10000;
		this.intervalo = 1000/velocidad;

		this.sonido = document.createElement("audio");
		this.sonido.src = "/static/img/img-juego/aviso.mp3";
	}
	dibujar(){
		ctx.font = "25px Arial";
		ctx.fillText(nivel.toString(), 550, 40);
		nivelJuego.innerHTML = nivel;
	}

	tick(){
		this.tiempo+=this.intervalo;
		if(this.tiempo >= this.limite){
			this.tiempo = 0;
			nivel++;
			this.sonido.play();
			velocidad-=3;
			velocidadSalto-=2;
			this.intervalo = Math.floor(1000/velocidad);
			clearInterval(bucle);
			bucle = setInterval("frame()", velocidad);
		}
	}

}
//Objetos
var mundo = new Mundo();
var runner = new Corredor();
var virus = new Virus(600);
var nubes = new Nubes(200);
for(i=0;i<=nVirus;i++){
	virus.agregar();
	nubes.agregar();
}
var tiempo;
//funciones de control
var velocidadSalto = 25;
var desplazamientoSalto = 5;
var puedeSaltar = true;
var salto;
function subir(){
	runner.y-=desplazamientoSalto;
	runner.actualizarBordes();
	if(runner.y <= 2){
		clearInterval(salto);
		salto = setInterval("bajar()", velocidadSalto);
	}
}
function bajar(){
	runner.y+=desplazamientoSalto;
	runner.actualizarBordes();
	if(runner.y >= (superficie-runner.h)){
		clearInterval(salto);
		puedeSaltar = true;
		puntajeAux += 5;
		numVirusAux += 1;
	}
}
function iniciarSalto(){
	salto = setInterval("subir()", velocidadSalto);
	puedeSaltar = false;
}
function saltar(event){
	if(event.keyCode == 38){
		if(puedeSaltar){
			iniciarSalto();
		}
	}
}
function findeJuego(){
	clearInterval(bucle);
	if(puntajeAux>puntajeMax){
		puntajeMax = puntajeAux;
		punMax.innerHTML = puntajeMax;
	}
	modal.style.display = "block";
	document.getElementById("imgbtn").src = "/static/img/img-juego/otravez.png";
	mundo = new Mundo();
	runner = new Corredor();
	velocidad = 50;
	velocidadSalto = 25;
	virus = new Virus(600);
	nubes = new Nubes(200);
	for(i=0;i<=nVirus;i++){
		virus.agregar();
		nubes.agregar();
	}
}
function choqueVirus(){
	var temp = virus;
	while(temp != null){
		if(temp.choque(runner)){
			//fin de juego
			findeJuego();
			break;
		} else {
			temp = temp.verSiguiente();
			puntaje.innerHTML = puntajeAux;
			numVirus.innerHTML = numVirusAux;
		}
	}
}
function destruirVirus(){
	if(virus.derecha < 0){
		virus = virus.verSiguiente();
	}
}

function destruirNubes(){
	if(nubes.derecha < 0){
		nubes = nubes.verSiguiente();
	}
}
//funciones globales
function dibujar(){
	ctx.clearRect(0,0,ancho, alto);
	mundo.dibujar();
	runner.dibujar();
	virus.dibujar();
	nubes.dibujar();
	tiempo.dibujar();
}
function frame(){
	dibujar();
	mundo.mover();
	virus.mover();
	nubes.mover();
	tiempo.tick();
	choqueVirus();
	destruirVirus();
	destruirNubes();
}

function iniciar(){
	puntajeAux = 0;
	numVirusAux = 0;
	puntaje.innerHTML = puntajeAux;
	numVirus.innerHTML = numVirusAux;
	modal.style.display = "none";
	bucle = setInterval("frame()", velocidad);
	tiempo = new Tiempo();
}