function Admin(tamano, Teclado, Manejo){
    this.tamano = tamano;
    this.teclado = new Teclado;
    this.manejo = new Manejo;
    this.primerasFichas = 2;
    this.teclado.on("mover", this.mover.bind(this));
    this.teclado.on("reiniciar", this.reiniciar.bind(this));
    this.teclado.on("reanudarJuego", this.reanudarJuego.bind(this));
    this.configJuego();
}


Admin.prototype.reiniciar = function(){
    this.manejo.continuarJuego();
    this.configJuego();
};

Admin.prototype.fichaInicial= function(){
    for(var i=0; i < this.primerasFichas; i++){
        this.agregarFichaAleatoria();
    }
};

Admin.prototype.reanudarJuego = function(){
    this.reanudarJuego = true;
    this.manejo.continuarJuego();
};

Admin.prototype.juegoTerminado = function(){
    return this.pierde || (this.gana && !this.reanudarJuego);
    if (this.pierde) {
      var $PUNTAJE = this.puntaje;
    }
};


Admin.prototype.configJuego = function(){
    this.plantilla = new Plantilla(this.tamano);
    this.puntaje =0;
    this.pierde = false;
    this.gana = false;
    this.reanudarJuego=false;
    this.fichaInicial();
    this.cambio();
};

Admin.prototype.serializar=function(){
    return{
        cuadricula: this.plantilla.serializar(),
        puntaje: this.puntaje,
        pierde: this.pierde,
        gana: this.gana,
        reanudarJuego: this.reanudarJuego
    };
};


Admin.prototype.agregarFichaAleatoria = function(){
    if(this.plantilla.celdasDis()){
        var valor;
        if(Math.random()<0.9){
            valor = 2;
        }
        else{
            valor = 4;
        }
        var ficha = new Ficha(this.plantilla.celdaDisponibleAleatoria(), valor);
        this.plantilla.insertarFicha(ficha);
    }
};


Admin.prototype.cambio= function(){
    this.manejo.cambio(this.plantilla,{
        puntaje: this.puntaje,
        pierde: this.pierde,
        gana: this.gana,
        terminado: this.juegoTerminado()
    });
};



Admin.prototype.prepararFichas= function(){
    this.plantilla.cadaCelda(function(x, y, ficha){
        if(ficha){
            ficha.combinadaCon = null;
            ficha.guardarPosicion();
        }
    });
};


Admin.prototype.vectorMovimiento = function(direccion){
    var mapa ={
        0: { x: 0, y: -1 },
        1: { x: 1, y: 0 },
        2: { x: 0, y: 1 },
        3: { x: -1, y: 0 }
    };

    return mapa[direccion];
};


Admin.prototype.recorridos = function(vector){
    var recorridos = { x: [], y: [] };

    for(var pos = 0; pos < this.tamano; pos++){
        recorridos.x.push(pos);
        recorridos.y.push(pos);
    }
    if(vector.x === 1){
        recorridos.x = recorridos.x.reverse();
    }
    if(vector.y === 1){
        recorridos.y = recorridos.y.reverse();
    }

    return recorridos;
};

Admin.prototype.moverFicha= function(ficha, celda){
    this.plantilla.celdas[ficha.x][ficha.y] = null;
    this.plantilla.celdas[celda.x][celda.y] = ficha;
    ficha.actualizarPosicion(celda);
};

Admin.prototype.mover=function(direccion){
    var self = this;
    if(this.juegoTerminado()){
        return;
    }
    var celda, ficha;

    var vector= this.vectorMovimiento(direccion);
    var recorridos= this.recorridos(vector);
    var movido=false;

    this.prepararFichas();

      recorridos.x.forEach(function(x){
        recorridos.y.forEach(function(y){
            celda = { x: x, y: y };
            ficha = self.plantilla.contenidoCelda(celda);

            if(ficha){
                var posiciones=self.posicionMasLejana(celda, vector);
                var proximo=self.plantilla.contenidoCelda(posiciones.siguente);

                if(proximo && proximo.valor == ficha.valor && !proximo.combinadaCon){
                    var combinado = new Ficha(posiciones.siguente, ficha.valor * 2);
                    combinado.combinadoCon = [ficha, proximo];

                    self.plantilla.insertarFicha(combinado);
                    self.plantilla.removerFicha(ficha);

                    ficha.actualizarPosicion(posiciones.siguente);
                    self.puntaje += combinado.valor;

                    if(combinado.valor === 2048){
                        self.gana = true;
                    }
                }else{
                    self.moverFicha(ficha, posiciones.maximo);
                }
                if(!self.posicionesIguales(celda, ficha)){
                    movido=true;
                }
            }
        });
    });

      if (movido){
        this.agregarFichaAleatoria();
        if(!this.movimientosDisponibles()){
            this.pierde=true;
        }
            this.cambio();
    }
};


Admin.prototype.posicionMasLejana = function(celda, vector){
    var anterior;
    do{
        anterior = celda;
        celda = {x: anterior.x + vector.x, y: anterior.y + vector.y};
    }while(this.plantilla.dentroLimites(celda)&& this.plantilla.celdaDis(celda));

    return{
        maximo: anterior,
        siguente: celda
    };
};


Admin.prototype.movimientosDisponibles = function(){
    return this.plantilla.celdasDis() || this.unionesDisponibles();
};


Admin.prototype.unionesDisponibles = function(){
    var self = this;
    var ficha;

    for (var x = 0; x < this.tamano; x++){
        for(var y = 0; y<this.tamano; y++){
            ficha = this.plantilla.contenidoCelda({x: x, y: y});

            if(ficha){
               for(var dir =0; dir<4; dir++){
                   var vector = self.vectorMovimiento(dir);
                   var celda = { x: x + vector.x, y: y + vector.y }

                   var otro = self.plantilla.contenidoCelda(celda);

                   if(otro && otro.valor === ficha.valor){
                       return true;
                   }
               }
            }
        }
    }
    return false;
};


Admin.prototype.posicionesIguales = function(p1,p2){
    return p1.x === p2.x && p1.y===p2.y;
};
