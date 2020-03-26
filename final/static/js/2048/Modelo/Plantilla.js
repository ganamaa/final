function Plantilla(tamano, estadoAnterior){
    this.tamano = tamano;
    if(estadoAnterior){
        this.celdas = this.delEstado(estadoAnterior);
    }else{
        this.celdas = this.vacio();
    }
}

Plantilla.prototype.vacio = function(){
    var celdas = [];
    for(var x = 0; x<this.tamano; x++){
        var fila = celdas[x] = [];
    }
    return celdas;
};

Plantilla.prototype.delEstado = function(estado){
    var celdas = [];
    for(var x=0; x<this.tamano; x++){
        
        var fila = celdas[x] = [];
        
        for(var y=0; y<this.tamano; y++){
            var ficha = estado[x][y];
            if(ficha){
                row.push(new Ficha(ficha.posicion, ficha.valor));
            }else{
                row.push(null);
            }
        }
    }
    return celdas;
};

Plantilla.prototype.celdaDisponibleAleatoria =function(){
    var celdas = this.celdasDisponibles();
    if(celdas.length){
        return celdas[Math.floor(Math.random()*celdas.length)];
    }
};

Plantilla.prototype.celdasDisponibles = function(){
    var celdas = [];
    this.cadaCelda(function (x,y,ficha){
        if(!ficha){
            celdas.push({ x: x, y: y });
        }
    });
    return celdas;
};

Plantilla.prototype.cadaCelda = function(callback){
    for(var x=0; x<this.tamano; x++){
        for(var y=0; y<this.tamano; y++){
            callback(x,y,this.celdas[x][y]);
        }
    }
};

Plantilla.prototype.celdasDis = function(){
    return !!this.celdasDisponibles().length
}

Plantilla.prototype.celdaDis = function(celda){
    return !this.celdaOcupada(celda);
}

Plantilla.prototype.celdaOcupada = function(celda){
    return !!this.contenidoCelda(celda);
}

Plantilla.prototype.contenidoCelda = function(celda){
    if(this.dentroLimites(celda)){
        return this.celdas[celda.x][celda.y];
    }
    else{
      return null;
    }
};

Plantilla.prototype.insertarFicha = function(ficha){
    this.celdas[ficha.x][ficha.y] = ficha;
};

Plantilla.prototype.removerFicha = function(ficha){
    this.celdas[ficha.x][ficha.y] = null;
};

Plantilla.prototype.dentroLimites = function(posicion){
    return posicion.x >= 0 && posicion.x < this.tamano && posicion.y >=0 && posicion.y < this.tamano;
};

Plantilla.prototype.serializar = function(){
    var estadoCelda =[];
    for(var x=0; x<this.tamano; x++){
        var fila = estadoCelda[x]=[];
        
        for(var y=0; y<this.tamano; y++){
            if(this.celdas[x][y]){
                fila.push(this.celdas[x][y].serializar());
            }else{
                fila.push(null);
            }
        }
    }
    return{
        tamano: this.tamano,
        celdas: estadoCelda
    };
};


