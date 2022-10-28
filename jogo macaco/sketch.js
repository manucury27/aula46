var  bordas, solo, soloInvisivel, imagemDaNuvem,pontuacao, grupoDeNuvens, imagemDoSolo,imagemFimDoJogo, imagemReiniciar;
var somSalto, somMorte, somCheckPoint, fimDoJogo, reiniciar, nuvem, fundo,sol, solImg;
var arvore1, arvore1Img, arvore2, arvore2Img;
var fundo1;
var amora, amoraImg, mirtilo, mirtiloImg, banana, bananaImg, morango, morangoImg;
var moeda, moedaImg;
var serpente, serpenteImg, porcoespinho, porcoespinhoImg;
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo= JOGAR;
var macaco, macacoImg;

function preload(){
  
  fundo = loadImage('fundocor.png');
  solImg = loadImage('solcor.png');
  macacoImg = loadImage('macaco.png');
  
  
  //carregar imagem do solo
  imagemDoSolo = loadImage("solocor.png");
  
  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvemcor.png");
  
  arvore1Img = loadImage("Amoreira.png");
  arvore2Img = loadImage("testebananeira.png");
  fundo1 = loadImage("floresta2.jpg");
  amoraImg = loadImage("amora.png");
  mirtiloImg = loadImage("mirtilo.png");
  bananaImg = loadImage("banana.png");
  morangoImg = loadImage("morango.webp");
  moedaImg = loadImage("moeda.png");
  serpenteImg = loadImage("serpente.png");
  porcoespinhoImg = loadImage("porcoespinho.png");

  //carregar imagens de final
  imagemFimDoJogo= loadImage("fimDoJogocor.png");
  imagemReiniciar= loadImage("reiniciarcor.png");
  
  //carregar sons
  somSalto = loadSound("pulo.mp3");
  somMorte = loadSound("morte.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup(){
  
  //cria a tela
  createCanvas(windowWidth,windowHeight);
  macaco = createSprite(150,height-100);
  macaco.addImage('macaco',macacoImg);
  macaco.scale = 0.3;

  sol = createSprite(width-50,40);
  sol.addImage('sol', solImg);
  sol.scale = 0.15;
  
  //cria solo
  solo = createSprite(width/2,height,width,20);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo)
  solo.x = width/2;
  solo.scale = 0.6;
  
  //cria solo invisível
  soloInvisivel = createSprite(300,height-10,600,10);
  soloInvisivel.visible = false;
  arvore1 = createSprite(1200,height-150);
  arvore1.addImage(arvore1Img);
  arvore1.scale = 1.2;
  arvore2 = createSprite(350,height-250);
  arvore2.addImage(arvore2Img);
  arvore2.scale = 0.9;
 
  pontuacao = 0
  
  //criar grupos de nuvens e obstáculos
 
  grupoDeNuvens = new Group();
  
  //adicionar e ajustar imagens do fim
  fimDoJogo = createSprite(width/2,height/2-20,400,20);
  fimDoJogo.addImage(imagemFimDoJogo);

  reiniciar = createSprite(width/2,height/2+20);
  reiniciar.addImage(imagemReiniciar);

  fimDoJogo.scale = 0.5;
  fimDoJogo.depth = fimDoJogo.depth+100
  reiniciar.scale = 0.07;
  reiniciar.depth = reiniciar.depth+100
  fimDoJogo.visible = false;
  reiniciar.visible = false;
  
  
  
  
  //para Trex inteligente
  //trex.setCollider("rectangle",250,0);

}

function draw(){
  //fundo branco
  background(fundo1);
  
  fill('white');
  textSize(16);
  text("Pontuação: "+pontuacao,width/2-50,30);
  
  //desenha os sprites
  drawSprites();
  

  //estados de jogo
  if(estadoJogo === JOGAR){
  
    
    //faz o T-Rex correr adicionando velocidade ao solo
    solo.velocityX = -(8 + pontuacao/30);
    //faz o solo voltar ao centro se metade dele sair da tela
    if (solo.x<0){
      solo.x=width/2;
    }
    
    //som a cada 100 pontos
    if(pontuacao>0 && pontuacao%100 === 0){
        somCheckPoint.play();
    }
    if (keyDown('space')) {
      macaco.velocityY = -8;
    }
    if (keyDown('RIGHT_ARROW')) {
      macaco.x = macaco.x +3;
    }
    if (keyDown('LEFT_ARROW')) {
      macaco.x = macaco.x -3;
    }
    macaco.velocityY = macaco.velocityY +1;
    macaco.collide(soloInvisivel);

    //T-Rex pula ao apertar espaço
    /*
    if(touches.length>0 && trex.y>height-80 || keyDown('space') && trex.y>height-80){
      trex.velocityY = -16; 
      somSalto.play();
      touches = [];
    }
    */
  
    //gerar nuvens
    gerarNuvens();
   
    //pontuação continua rodando
    pontuacao = pontuacao + Math.round(frameRate()/42)
    

    //imagens do fim ficam invisíveis
    fimDoJogo.visible = false;
    reiniciar.visible = false;
    
    //quando o trex toca o obstáculo, o jogo se encerra
    /*
    if(grupoDeObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      //som de morte
      somMorte.play();
      
      //Trex inteligente
      //trex.velocityY= -12;
      //somSalto.play();

    }
    */
  } else if(estadoJogo === ENCERRAR){
    //para os sprites em movimento
    
    solo.velocityX = 0;
    
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
   
    grupoDeNuvens.setLifetimeEach(-1);
    
   
    //mostrar imagens do fim
    fimDoJogo.visible = true;
    reiniciar.visible = true;
    
    if(mousePressedOver(reiniciar)|| touches.length>0){
      reinicie();
      touches = [];
    }
    
  }
}

function gerarNuvens(){
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if(frameCount %60 === 0){
    nuvem = createSprite(width,300,40,10);
    nuvem.y = Math.round(random(20,height*1/3));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale =0.4;
    //ajustar profundidade da nuvem
    nuvem.depth = macaco.depth;
    macaco.depth = macaco.depth +1;
    //dar velocidade e direção à nuvem
    nuvem.velocityX=-3;
    //dar tempo de vida à nuvem
    nuvem.lifetime = width/3+20;
    //adicionar a um grupo
    grupoDeNuvens.add(nuvem);
  }
}



function reinicie(){
  estadoJogo = JOGAR;
  fimDoJogo.visible = false;
  reiniciar.visible = false;
  
  
  grupoDeNuvens.destroyEach();
  
 
  
  pontuacao = 0;
}