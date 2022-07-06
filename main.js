/*creado por prashant shukla */
game_status ="";


var paddle2 =10,paddle1=10;

var paddle1X = 10,paddle1Height = 110;
var paddle2Y = 685,paddle2Height = 70;

var score1 = 0, score2 =0;
var paddle1Y;

var  playerscore =0;
var audio1;
var pcscore =0;
rightwristX = 0;
rightwristY = 0;
scorerightwrist = 0; 
// x,y y speedx speedy y radio de la pelota
var ball = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}


function setup(){
  var canvas =  createCanvas(700,600);
  canvas.parent('canvas');

  video = createCapture(VIDEO);
  video.size(700, 600);
  video.hide();
  poseNet=ml5.poseNet(video,modelLoaded);
  poseNet.on('pose', gotPoses);
}

function preload(){
pelota =loadSound("ball_touch_paddel.wav");
paleta =loadSound("missed.wav");
}


function modelLoaded() {
  console.log('PoseNet se ha inicializado');
}

function gotPoses(results)
{
  if(results.length > 0)
  {
    rightwristX  = results[0].pose.rightWrist.x;
    rightwristY = results[0].pose.rightWrist.y;
    scorerightwrist = results[0].pose.keypoints[10].score;
  }
}

function startGame()
{
game_status ="start";
document.getElementById("status").innerHTML ="El juego esta cargado -3-";
}

/**4. Dibuja la vista de la cámara en el lienzo.*/
function draw(){
if (game_status=="start") {

  //if (scorerightwrist >0.2) {
   fill("purple");
   stroke("purple");
   circle(rightwristX, rightwristY,30);
 // }
 background(0);
 image(video,0,0,700,600);
 fill("black");
 stroke("black");
 rect(680,0,20,700);

 fill("black");
 stroke("black");
 rect(0,0,20,700);
 
   //llamar la función paddleInCanvas
   paddleInCanvas();
 
   //paleta izquierda
   fill(250,0,0);
    stroke(0,0,250);
    strokeWeight(0.5);
   paddle1Y = rightwristY;
   rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);
   
   
    //paleta de la computadora
    fill("#FFA500");
    stroke("#FFA500");
   var paddle2y =ball.y-paddle2Height/2;  rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
   
    //llamar función midline
    midline();
   
    //llamar función drawScore
   drawScore();
   
   //llamar función models
   models();
   
   //llamar función move que es muy importante
    move();
}
 
}



//función reset cuando la pelota no hace contacto con la paleta
function reset(){
   ball.x = width/2+100,
   ball.y = height/2+100;
   ball.dx=3;
   ball.dy =3;
   
}


//función midline dibuja una línea en el centro
function midline(){
    for(i=0;i<480;i+=10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width/2,y+i,10,480);
    }
}


//función drawScore muestra la puntuación
function drawScore(){
    textAlign(CENTER);
    textSize(20);
    fill("white");
    stroke(250,0,0)
    text("Jugador:",100,50)
    text(playerscore,175,50);
    text("Computadora:",500,50)
    text(pcscore,600,50)
}


//una función muy importante del juego
function move(){
   fill(50,350,0);
   stroke(255,0,0);
   strokeWeight(0.5);
   ellipse(ball.x,ball.y,ball.r,20)
   ball.x = ball.x + ball.dx;
   ball.y = ball.y + ball.dy;
   if(ball.x+ball.r>width-ball.r/2){
       ball.dx=-ball.dx-0.5;      
   }
  if (ball.x-2.5*ball.r/2< 0){
  if (ball.y >= paddle1Y&& ball.y <= paddle1Y + paddle1Height) {
    ball.dx = -ball.dx+0.5;
    pelota.play();
  }
  else{
    pcscore++;
    paleta.play();
    reset();
    navigator.vibrate(100);
  }
}
if(pcscore ==4){
    fill("#FFA500");
    stroke(0)
    rect(0,0,width,height-1);
    fill("white");
    stroke("white");
    textSize(25)
    text("¡Fin del juego! ☹☹",width/2,height/2);
    text("Presiona boton de inicio para jugar de nuevo C=",width/2,height/2+30)
    noLoop();
    pcscore = 0;
}
   if(ball.y+ball.r > height || ball.y-ball.r <0){
       ball.dy =- ball.dy;
   }  
}


//ancho y alto del canvas y velocidad de la pelota
function models(){
    textSize(18);
    fill(255);
    noStroke();
    text("Ancho:"+width,150,15);
    text("Velocidad:"+abs(ball.dx),50,15);
    text("Alto:"+height,235,15)
}


//esta función ayuda para que la paleta no se salga del canvas
function paddleInCanvas(){
  if(mouseY+paddle1Height > height){
    mouseY=height-paddle1Height;
  }
  if(mouseY < 0){
    mouseY =0;
  }  
}
function restart(){
loop();
pcscore =0;
playerscore =0;

}