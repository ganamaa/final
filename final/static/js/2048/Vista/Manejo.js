function Manejo(){
    this.contenedorFicha = document.querySelector(".cuadro-ficha");
    this.puntajeActual = document.querySelector(".puntaje-actual");
    this.mensajeFinal = document.querySelector(".mensaje-final");
    this.puntaje =0;
}


Manejo.prototype.cambio = function(plantilla, reporteJuego){
    var self = this;
    window.requestAnimationFrame(function(){
        self.limpiarCuadro(self.contenedorFicha);
        plantilla.celdas.forEach(function(columna){
            columna.forEach(function(celda){
                if(celda){
                    self.agregarFicha(celda);
                }
            });
        });

        self.actualizarPuntaje(reporteJuego.puntaje);
        if(reporteJuego.terminado){
            if(reporteJuego.pierde){
                self.mensaje(false);
            }else if(reporteJuego.gana){
                self.mensaje(true);
            }
        }

    });
};

Manejo.prototype.agregarFicha = function(ficha){
    var self = this;

    var caja = document.createElement("div");
    var contenido = document.createElement("div");
    var posicion = ficha.posicionPrevia || { x: ficha.x, y: ficha.y };
    var clasePosicion = this.clasePosicion(posicion);
    var clases = ["ficha", "ficha-"+ficha.valor, clasePosicion];

    if(ficha.valor > 2048) clases.push("ficha-super");

    this.aplicarClases(caja,clases);

    contenido.classList.add("contenido-ficha");
    contenido.textContent = ficha.valor;

    if(ficha.posicionPrevia){
        window.requestAnimationFrame(function(){
            clases[2] = self.clasePosicion({ x: ficha.x, y: ficha.y });
            self.aplicarClases(caja,clases);
        });
    }else if(ficha.combinadaCon){
        clases.push("combinacion-ficha");
        this.aplicarClases(caja,clases);
        ficha.combinadaCon.forEach(function(combinada){
            self.agregarFicha(combinada);
        });
    }else{
        clases.push("nueva-ficha");
        this.aplicarClases(caja, clases);
    }

    caja.appendChild(contenido);
    this.contenedorFicha.appendChild(caja);
};

Manejo.prototype.posicionFinal = function(posicion){
    return { x: posicion.x + 1, y: posicion.y + 1 };
};


Manejo.prototype.continuarJuego = function(){
    this.quitarMensajeFinal();
};


Manejo.prototype.limpiarCuadro = function(cuadro){
    while(cuadro.firstChild){
        cuadro.removeChild(cuadro.firstChild);
    }
};


Manejo.prototype.clasePosicion = function(posicion){
    posicion = this.posicionFinal(posicion);
    return "posicion-ficha-" + posicion.x + "-" + posicion.y;
};


Manejo.prototype.actualizarPuntaje = function(puntaje){
    this.limpiarCuadro(this.puntajeActual);
    this.puntajeActual.textContent = puntaje;
};


Manejo.prototype.mensaje = function(gana){
    var tipo;
    var mensaje;
    if(gana){
        tipo = "juego-ganado";
        mensaje = "¡Ganaste!";
    }else{
        tipo = "juego-perdido";
        mensaje = "Has perdido";
    }

    this.mensajeFinal.classList.add(tipo);
    this.mensajeFinal.getElementsByTagName("p")[0].textContent = mensaje;
};


Manejo.prototype.quitarMensajeFinal = function(){
    this.mensajeFinal.classList.remove("juego-ganado");
    this.mensajeFinal.classList.remove("juego-perdido");
};

Manejo.prototype.aplicarClases = function(elemento, clases){
    elemento.setAttribute("class",clases.join(" "));
};
