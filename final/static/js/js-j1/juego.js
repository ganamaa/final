var fondoJ;
var person;
var obs;
var salto;
var timer;
var puntos;
var txtPuntos;
var txtInicio;
var pausa;

var Juego = {    
    
    preload: function(){
        
        juego.load.image('fondo', '/static/img/img-j1/giphy.jpg');
        juego.load.image('personaje', '/static/img/img-j1/personaje1.png');
        juego.load.image('obstaculo', '/static/img/img-j1/obstaculo.png');        
        
        juego.forceSingleUpdate = true;
    },
    
    create: function(){
        
        fondoJ = juego.add.tileSprite(0, 0, 1070, 575, 'fondo');     
        person = juego.add.sprite(50 , juego.height/2, 'personaje');
            person.scale.setTo(0.25);
        juego.physics.startSystem(Phaser.Physics.ARCADE);
            juego.physics.arcade.enable(person);
            person.body.collideWorldBounds = true;
            person.body.gravity.y = 2000;
            obs = juego.add.group();
            obs.enableBody = true;
            obs.createMultiple(100, 'obstaculo');
        salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            salto.onDown.add(this.saltar, this);
        
		pausa = juego.input.keyboard.addKey(Phaser.Keyboard.ESC);
            pausa.onDown.add(this.pausar, this);
			
        timer = juego.time.events.loop(1200, this.crearObstaculos, this);
        
        puntos = 0;
        txtPuntos =juego.add.text(20, 20, "0", {font: "30px Arial", fill: "#FFF"});
		txtInicio =juego.add.text(juego.width / 2, juego.height / 2, "Presione espacio para empezar", {font: "30px Arial", fill: "#FFF"});
		juego.paused = true;
    },
    
    update: function(){        
        fondoJ.tilePosition.x -= 1;
        juego.physics.arcade.overlap(person, obs, this.tocoObstaculo, null, this);
	if(person.body.y == 0 || person.body.y == 513){
		if(person.alive == false)
			return;
		person.alive = false;
		juego.time.events.remove(timer);
			
		obs.forEachAlive(function(o){
			o.body.velocity.x = 0;
		}, this);
		this.state.start('Fin');
	}
    },
    
    saltar: function(){
        person.body.velocity.y = -500;
		if (juego.paused && txtInicio.text == "Presione espacio para empezar"){
			juego.paused = false;
			txtInicio.text = "";
		}
    },
    
    pausar: function(){
		if (juego.paused){
			juego.paused = false;
			txtInicio.text = "";
		}else if (juego.paused == false){
			juego.paused = true;
			txtInicio.text = "Pausa";
		}
    },
	
    crearObstaculos: function(){
        
        for( var i = 0; i < 1; i++){
            var carril = i+Math.floor((Math.random()*6))
			if(carril == 0){
				this.crearUnObstaculo(1000, 30);
			}else if(carril == 1){
				this.crearUnObstaculo(1000, 118);
			}else if(carril == 2){
				this.crearUnObstaculo(1000, 206);
			}else if(carril == 3){
				this.crearUnObstaculo(1000, 294);
			}else if(carril == 4){
				this.crearUnObstaculo(1000, 382);
			}else if(carril == 5){
				this.crearUnObstaculo(1000, 470);
			}
			
        }
		puntos += 1;
        txtPuntos.text = puntos;
    },
    
    crearUnObstaculo: function(x, y){
        var obstaculo = obs.getFirstDead();
        
        obstaculo.reset(x, y);
        obstaculo.body.velocity.x = -180;
        obstaculo.checkWorldBounds = true;
        obstaculo.outOfBoundsKill = true;    
    },
    
    tocoObstaculo: function(){
        if(person.alive == false)
            return;
        person.alive = false;
        juego.time.events.remove(timer);
        
        obs.forEachAlive(function(o){
            o.body.velocity.x = 0;
        }, this);
        this.state.start('Fin');
    }
};
