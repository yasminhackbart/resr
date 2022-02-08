var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var nuvem,imagemnuvem;
var obst1,obst2,obst3,obst4,obst5,obst6;
var rand;
var obstaculo;
var pontuacao;
var jogar = 1;
var encerrar = 0;
var estadodojogo = jogar;
var grupodeobstaculos, grupodenuvens;
var fimjogo,reiniciojogo;
var imagemfim,imagemreinicio;
var contagem;
var somsalto,sommorte,somcheckpoint;

 

function preload(){
  //carregando imagens trex
  trex_correndo = loadAnimation("trex1.png","trex2.png","trex3.png");
  
  trex_colidiu = loadAnimation("trex_collided.png");

  trexabaixou = loadAnimation("bird.png")
  
  //carregando imagem solo
  imagemdosolo = loadImage("ground2.png");
  
  //carregando imagem nuvem
  imagemnuvem = loadImage("cloud.png");
  
  //carregamento de imagens dos obstaculos
  obst1 = loadImage("obstacle1.png");
  obst2 = loadImage("obstacle2.png");
  obst3 = loadImage("obstacle3.png");
  obst4 = loadImage("obstacle4.png");
  obst5 = loadImage("obstacle5.png");
  obst6 = loadImage("obstacle6.png");
  
  //carregando imagem fim e reinicio
  imagemfim = loadImage("gameOver.png");
  imagemreinicio = loadImage("restart.png");
 
  //carregando os sons
  somsalto =loadSound("jump.mp3");
  sommorte= loadSound("die.mp3");
  somcheckpoint= loadSound("checkPoint.mp3");
  
}

function setup() {

  createCanvas(600,200)
  
  //criar um sprite do trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.scale = 0.5;
  
  //trexcolidiu
  trex.addAnimation("collided" , trex_colidiu);

  //trexabaixou
  trex.addAnimation("baixou",trexabaixou);
  
  //criar um sprite do solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  //creating invisible ground
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  //pontuacao inical
  pontuacao = 0;

  // grupos 
  grupodeobstaculos = new Group();
  grupodenuvens = new Group();
  
  //raio colisor
  trex.setCollider("circle",0,0,40);
  trex.debug = true;
  
  //fazendo as sprites fim e reinicio
  fimjogo = createSprite(300,100);
  fimjogo.addImage("fim",imagemfim);
  fimjogo.visible = false;
  fimjogo.scale =0.5;
  
  reiniciojogo = createSprite(300,125);
  reiniciojogo.addImage("reiniciar",imagemreinicio);
  reiniciojogo.visible = false;
  reiniciojogo.scale=0.3;
  
  //iniciando contador de segundos
  contagem=0;
}

function draw() {
  //definir cor de fundo
  background("lightblue");
  
  //contando tempo de jogo
  //contagem=World.seconds;
  //console.log(contagem);
  
 //console.log("estado do jogo:" +estadodojogo);
  
  //estados de jogos
  if(estadodojogo == jogar){
    
    //mover solo
    solo.velocityX = -(4+2*pontuacao/100);
    
    //sistema de pontuacao
    text("Score: "+ pontuacao,500,50);
    pontuacao = pontuacao + Math.round(frameCount/60);
    
    // pular quando a tecla espaço é acionada
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -12;
      somsalto.play();
      
    }
     //gravidade
     trex.velocityY = trex.velocityY + 0.8;
  
    //reiniciando o solo
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //gerar nuvens
    gerarnuvens();
    //console.log(frameCount);

    //gerar obstaculos
    gerarobstaculos();

    if(pontuacao >0 && pontuacao%400==0){
      somcheckpoint.play();
    }
    if(grupodeobstaculos.isTouching(trex)){
      estadodojogo = encerrar;
      sommorte.play();
    }

  } else if (estadodojogo == encerrar){
    solo.velocityX = 0;
    trex.velocityY=0;
    
     //altera a animação do Trex
    trex.changeAnimation("collided", trex_colidiu);
    
    //seta as velocidades
    grupodeobstaculos.setVelocityXEach(0);
    grupodenuvens.setVelocityXEach(0);
    
    //seta tempo de vida
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
    
   if(keyDown("down")){
     trex.changeAnimation("baixou")
   }
    
    //torna menu visivel
    fimjogo.visible = true;
    reiniciojogo.visible = true;
    
     if(mousePressedOver(reiniciojogo)){
      reset();
    } 
  }
  

  //impedir o trex de cair 
  trex.collide(soloinvisivel);
  
  
  drawSprites();
  
}

function gerarnuvens(){
  // colocar nuvem de 60 em 60 quadros
  if(frameCount % 60 == 0){
    nuvem = createSprite (600,100,40,10);
    nuvem.addImage("nuvem",imagemnuvem);
    nuvem.scale = 0.5;
    nuvem.y = Math.round(random(5,80));
    //console.log(nuvem.depth);
    //console.log(trex.depth);
    //console.log("oi"+ "mundo");
    nuvem.velocityX = -3;
    nuvem.lifetime = 200;
    nuvem.scale = random(0.10,0.5);
    //profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    grupodenuvens.add(nuvem);
  }
}

function gerarobstaculos(){
  //a cada 60 frames
   if(frameCount % 60 == 0){
      //cria a sprite do obstasculo
      obstaculo = createSprite (400,170,40,10);
      obstaculo.velocityX = -(4+2*pontuacao/100);
      //sorteia numero de 1 a 6 para os obstaculos
      rand = Math.round(random(1,6));
     
     
     switch(rand){
       case 1:     obstaculo.addImage("obs1",obst1);
                   break;
                   
       case 2:     obstaculo.addImage("obs2",obst2);
                   break;
         
       case 3:     obstaculo.addImage("obs3",obst3);
                   break;
         
       case 4:     obstaculo.addImage("obs4",obst4);
                   break;
         
       case 5:     obstaculo.addImage("obs5",obst5);
                   break;
         
       case 6:     obstaculo.addImage("obs6",obst6);
                   break;
         
         
       default: break;   
     }
     obstaculo.scale = 0.5;
     obstaculo.lifetime = 150;
     
     //ADICIONANDO OBSTACULO AO GRUPO
     grupodeobstaculos.add(obstaculo);
    }
}

function reset(){
  estadodojogo = jogar;
  fimjogo.visible = false;
  reiniciojogo.visible = false;
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  
  trex.changeAnimation("running",trex_correndo);
  
  pontuacao = 0;
  
}

