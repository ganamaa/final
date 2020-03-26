var cv, cv2, ctx2, ctx, fondo, fondo2, objetos, nave, p, imP, disparos, controles;
var disparosEn, vidaE, jugando, direccion, espera, py, numEsp, boton, MejorPuntuacion, temDisparoAliado;

MejorPuntuacion=0; //asignar lo que se tenga guardado antes....
this.controles = this.document.createElement('img');
this.controles.src = "/static/img/img-paloma/controles.png";

this.fondo2 = this.document.createElement('img');
this.fondo2.src = "/static/img/img-paloma/fondo2.png";

// carga todo el juego de nuevo--------------------------------

function darclick(){
    console.log(this.id+": Clicked!");
    if(jugando==false){
        if(p[0].puntuacion>MejorPuntuacion){
            MejorPuntuacion=p[0].puntuacion;
        }
        jugando=true;
    window.onload();
    }
    

}

function actualizar(){ 


   

    ctx.clearRect(0,0,1100,600);
    ctx.drawImage(fondo, 0 , 0, 1100, 600);

    //texto puntuacion
    ctx.fillStyle = "#000000";
	ctx.font = "20px sans-serif";
    ctx.fillText("Puntuacion", 40 ,20);
    ctx.fillStyle = "#ff0000"; 
	ctx.font = "20px sans-serif";
    ctx.fillText(p[0].puntuacion, 40 ,40);

    //texto vida
    ctx.fillStyle = "#000000";
	ctx.font = "20px sans-serif";
    ctx.fillText("vida", 180 ,20);
    ctx.fillStyle = "#ff0000";
	ctx.font = "20px sans-serif";
    ctx.fillText(p[0].vida, 180 ,40);

            
    
    if(objetos.length==0){ //pide mas enemigos si no hay
        masEnemigos();
    }

    for(var i=0; i< objetos.length; i++){//dibuja todos los enemigos
        ctx.drawImage(objetos[i].imagen,objetos[i].x, objetos[i].y ,
                 objetos[i].width, objetos[i].height);

    }

    ctx.drawImage(imP, p[0].x,  p[0].y,  p[0].width,  p[0].height);//dibuja el personaje principal

    animaEnemigo();//efecto animacion enemigos
    crearProyectilEnemigo();

    disparar();
    proyectil();//colicion y animacion de proyectiles aliados
    proyectilEnemigo();//colicion y animacion de proyectiles enemigos

    for(var j=0; j< disparos.length; j++){//dibuja los proyectiles aliados
        ctx.drawImage(py,disparos[j].x, disparos[j].y ,
            disparos[j].width, disparos[j].height);

    }

    for(var j=0; j< disparosEn.length; j++){//dibuja los proyectiles enemigos
        ctx.drawImage(py,disparosEn[j].x, disparosEn[j].y ,
            disparosEn[j].width, disparosEn[j].height);

    }
    

    if(jugando){
        requestAnimationFrame(actualizar);
    }else{
        ctx.fillStyle = "#ff0000";
	    ctx.font = "80px sans-serif";
        ctx.fillText("Fin del juego!!", 400 ,300);
        
    }
    
}



//---------------------------entradas de teclado

document.onkeydown = function(event){

    if(event.which==87) 
        if(p[0].y > 10)
            p[0].y= p[0].y - 10;

    if(event.which==83)
        if(p[0].y < 500)
            p[0].y= p[0].y + 10;
        
    if( event.which==68)
        if(p[0].x < 1020)
            p[0].x= p[0].x +10;
    
    if(event.which==65)
        if(p[0].x > 40)
            p[0].x= p[0].x -10;
     

}

//--------------------animacion naves enemigas
function animaEnemigo(){
    
    var cantidad=1;
    if(direccion<0)
        cantidad*=-1;

        for(var i=0; i< objetos.length; i++){
            objetos[i].x=objetos[i].x+cantidad;
        }


    direccion=direccion+1;
    if(direccion==50)
        direccion=-50;

}

//---------------llena el tablero de mas enemigos

function masEnemigos(){
    numEsp-=10;
    espera=0;
    vidaE+=2;
    for(var j=0; j<3; j++)
    for(var i=0; i<13; i++){
        nave = this.document.createElement('img');
        nave.src = "/static/img/img-paloma/nave.png";
        objetos.push({
                x:20+ (80*i),
                y:60 + (80*j),
                width: 60, height: 60,
                vida:this.vidaE,
                imagen:nave
            });
    }

}
//--------------crea los disparos de los enemigos
function crearProyectilEnemigo(){

    if(espera==0){
        var num = Math.floor((Math.random() * (objetos.length-0))+0);

    disparosEn.push({
        x:objetos[num].x+23,
        y:objetos[num].y+60,
        width: 10,
        height:17
    });

    
    }
    espera+=5;
    if(espera>numEsp){
        espera=0;
    }
    

}
//---------------------------------movimiento de los proyectiles enemigos y colicion contra personaje principal
function proyectilEnemigo(){

    for(var j=0; j< disparosEn.length; j++){
        if(disparosEn[j].y > 550){
            disparosEn.splice(j, 1);
        }else{
            disparosEn[j].y= disparosEn[j].y+3;
            if(p[0].y+30 > disparosEn[j].y && p[0].y < disparosEn[j].y &&
                p[0].x <= disparosEn[j].x && p[0].x+30  >= disparosEn[j].x){
                    p[0].vida-=1;
                    disparosEn.splice(j, 1);
                    if(p[0].vida==0){
                        jugando=false;
                    }
                    
                }
                

        }

    }


}

//--- diparo automatico del aliado

function disparar(){

    if(temDisparoAliado==10){

        disparos.push({
            x:p[0].x+15,
            y:p[0].y+15,
            width: 10,
            height:17
        });
        temDisparoAliado=0;

    }else{

        temDisparoAliado+=1;

    }


}


//---------------------------------funcion movimiento de los proyectiles aliados, y colicion contra naves enemigas
function proyectil(){

    for(var j=0; j< disparos.length; j++){
        if(disparos[j].y <= 10){
            disparos.splice(j, 1);
        }else{
            disparos[j].y= disparos[j].y-4;
            for(var i=0; i< objetos.length; i++){

                if(objetos[i].y+50 > disparos[j].y &&
                    objetos[i].y < disparos[j].y &&
                    objetos[i].x <= disparos[j].x &&
                    objetos[i].x+50  >= disparos[j].x){


                    objetos[i].vida=  objetos[i].vida-1;

                    if(objetos[i].vida< (vidaE/2+1)){
                        objetos[i].imagen.src= "/static/img/img-paloma/naveD.png";
                    }

                    if(objetos[i].vida==0)  {
                        objetos.splice(i, 1);
                        p[0].puntuacion+=1;
                    }
                    

                    
                    disparos.splice(j, 1);
                 i=objetos.length;
                }
        
            }
            

        }
        

    }

}

//-- canvas de controles y mejor puntaje

function dibControles(){

    ctx2.clearRect(0,0,1100,100);

    ctx2.drawImage(fondo2,0,0,1100,100);

    ctx2.fillStyle = "#000000";
	ctx2.font = "20px sans-serif";
    ctx2.fillText("Mejor Puntuacion: ", 40 ,60);

    ctx2.fillStyle = "#000000";
	ctx2.font = "20px sans-serif";
    ctx2.fillText(MejorPuntuacion, 210 ,60);

    ctx2.fillStyle = "#000000";
	ctx2.font = "20px sans-serif";
    ctx2.fillText("controles", 500 ,60);

    ctx2.drawImage(controles,600,10,400,80);
    

}


//----------------------------carga al iniciar la pantalla
window.onload = function() {

    
    
    //vida de las naves enemigas
    this.vidaE=2;

    this.jugando=true;

    this.numEsp=150;//espera en lanzamiento de proyectil enemigo
    this.espera=0;

    this.temDisparoAliado=0;//contador para el tiempo del disparo aliado 
    
    cv = document.getElementById('lienzo');
    ctx = cv.getContext('2d');
   
    cv2 = document.getElementById('ct');
    ctx2 = cv2.getContext('2d');
    


    
    this.direccion=0;//las naves enemigas inician hacia la derecha, direcion negativa es movimiento a la izquierda
   
    p = [];
    p.push({
        x:20, y:500,
        width: 40, height: 70,
        vida:5,
        puntuacion:0
    });

    this.imP = this.document.createElement('img');
    this.imP.src = "/static/img/img-paloma/pr.png";

    
    this.disparos =[]; //disparos del personaje
    this.disparosEn =[];//disparos de los enemigos
    
    
    objetos =[];
    for(var j=0; j<3; j++)
    for(var i=0; i<13; i++){
        nave = this.document.createElement('img');
        nave.src = "/static/img/img-paloma/nave.png";
        objetos.push({
                x:20+ (80*i),
                y:60 + (80*j),
                width: 60, height: 60,
                vida:this.vidaE,
                imagen:nave
            });
    }
            

    this.fondo = this.document.createElement('img');
    this.fondo.src = "/static/img/img-paloma/fondo.jpg";

    this.py = this.document.createElement('img');
    this.py.src = "/static/img/img-paloma/proyectil.png";

    this.dibControles();
    this.actualizar();
};
