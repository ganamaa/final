function Teclado(){
    this.eventos={};
    this.listen();
}


Teclado.prototype.on = function(evento, callback){
    if(!this.eventos[evento]){
        this.eventos[evento]=[];
    }
    this.eventos[evento].push(callback);
};

Teclado.prototype.emitir=function(evento, info){  //Antes data
    var callbacks=this.eventos[evento];
    if(callbacks){
        callbacks.forEach(function(callback){
            callback(info);
        });
    }  
};


Teclado.prototype.listen=function(){
    var self=this;
    var mapa={
        38:0, 
        39:1, 
        40:2,
        37:3, 
    };
   
    document.addEventListener("keydown", function(event){
        var teclaPresionada= mapa[event.which];            //Antes mapped
        
        if(teclaPresionada !== undefined){
            event.preventDefault();
            self.emitir("mover",teclaPresionada);
        }
    });    
    
    this.botonPresionado(".boton-reintentar", this.reiniciar);
    this.botonPresionado(".reiniciar", this.reiniciar);
    this.botonPresionado(".boton-seguir-jugando", this.reanudarJuego );
};

Teclado.prototype.reiniciar = function(evento){
    evento.preventDefault();
    this.emitir("reiniciar");
};

Teclado.prototype.reanudarJuego= function(evento){
    evento.preventDefault();
    this.emitir("reanudarJuego")
};

Teclado.prototype.botonPresionado=function(selector, fn){
    var boton= document.querySelector(selector);
    boton.addEventListener("click", fn.bind(this));
};