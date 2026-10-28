const botaoMusica = document.getElementById("music-button");
const musicaFundo = document.getElementById("background-music");
const botaoJogar = document.getElementById("start-button");
const explosao = document.getElementById("explosion");
const somExplosao = document.getElementById("explosion-sound");
const telaInicial = document.getElementById("start-screen");
const gato = document.getElementById("nyan-cat");
const tabuleiro = document.getElementById("game-board");
const telaFinal = document.getElementById("game-over-screen");
const tempoJogo = document.getElementById("time");
const asteroide = document.querySelector(".asteroid");
const estrela = document.getElementById("bonus-star");
const botaoReiniciar = document.getElementById("restart-button");
const pontosJogo = document.getElementById("score");
const recordeJogo = document.getElementById("high-score");
const finalPontos = document.getElementById("final-score");
const gravidade = 0.5;
const margemGato = 15;
const margemAsteroide = 10;
const velocidadeAsteroide = 20;
const velocidadeEstrela = 6;

let pontos = 0;
let recorde = 0;
let estrelaX;
let asteroideX;
let jogoRodando = false;
let gatoY = 200;
let velocidade = 0;
let relogio;
let segundos = 0;
let relogioTempo;

function acaoPrincipal(){
	if (jogoRodando){
		pular();
	} else {
		iniciarJogo();
	}
}

function iniciarJogo(){
	if(jogoRodando){
		return;
	}
	gatoY = 200;
	velocidade = 0;
	gato.style.top = gatoY + "px";
	telaFinal.hidden = true;
	relogio = setInterval(atualizarJogo, 20);
	telaInicial.hidden = true;
	jogoRodando = true;
	asteroide.hidden = false;
	reposicionarAsteroide();
	pontos = 0;
	pontosJogo.textContent = pontos;
	finalPontos.textContent = pontos;
	segundos = 0;
	relogioTempo = setInterval(contarSegundo, 1000); 
	tempoJogo.textContent = segundos;
	gato.hidden = false;
	explosao.hidden = true;
	estrela.hidden = false;
	reposicionarEstrela();
}

function atualizarJogo(){
	velocidade += gravidade;
	gatoY += velocidade;
	gato.style.top = gatoY + "px";
	if(gatoY < 0 || gatoY + gato.offsetHeight > tabuleiro.clientHeight){
		fimDeJogo();
	}
	asteroideX -= velocidadeAsteroide;
	asteroide.style.left = asteroideX + "px";
	
	if(asteroideX + asteroide.offsetWidth < 0){
		reposicionarAsteroide();
		pontos += 1;
		pontosJogo.textContent = pontos;
		finalPontos.textContent = pontos;
	}
	
	const caixaGato = gato.getBoundingClientRect();
	const caixaAsteroide = asteroide.getBoundingClientRect();
	
	if (caixaGato.top + margemGato < caixaAsteroide.bottom - margemAsteroide &&
		caixaGato.bottom - margemGato > caixaAsteroide.top + margemAsteroide &&
		caixaGato.left + margemGato < caixaAsteroide.right - margemAsteroide &&
		caixaGato.right - margemGato > caixaAsteroide.left + margemAsteroide){
		fimDeJogo();
	}
	
	estrelaX -= velocidadeEstrela;
	estrela.style.left = estrelaX + "px";
	
	if (estrelaX + estrela.offsetWidth < 0){
		reposicionarEstrela();
	}
	
	const caixaEstrela = estrela.getBoundingClientRect();
	
	if (caixaGato.top + margemGato < caixaEstrela.bottom  &&
		caixaGato.bottom - margemGato > caixaEstrela.top  &&
		caixaGato.left + margemGato < caixaEstrela.right  &&
		caixaGato.right - margemGato > caixaEstrela.left){
		
		pontos += 5;
		
		pontosJogo.textContent = pontos;
		finalPontos.textContent = pontos;
		
		reposicionarEstrela();
		
	}
	
}

function pular(){
	velocidade = -6;
}

function contarSegundo(){
	segundos += 1;
	tempoJogo.textContent = segundos;
}

function fimDeJogo(){
	clearInterval(relogio);
	if (!jogoRodando){
		return;
	}
	jogoRodando = false;
	telaFinal.hidden = false;
	if (pontos > recorde) {
    recorde = pontos;
	recordeJogo.textContent = recorde;
	}
	clearInterval(relogioTempo);
	explosao.style.left = gato.offsetLeft + "px";
	explosao.style.top = gatoY + "px";
	gato.hidden = true;
	explosao.hidden = false;
	somExplosao.play();
}

function reposicionarAsteroide(){
	asteroideX = tabuleiro.clientWidth;
	asteroide.style.top = Math.random() * (tabuleiro.clientHeight - asteroide.offsetHeight) + "px";
	asteroide.style.left = asteroideX + "px";
}

function reposicionarEstrela(){
	estrelaX = tabuleiro.clientWidth + Math.random() * 600;
	estrela.style.top = Math.random() * (tabuleiro.clientHeight - estrela.offsetHeight) + "px";
	estrela.style.left = estrelaX + "px";
}

botaoReiniciar.addEventListener("click", iniciarJogo);

botaoJogar.addEventListener("click", iniciarJogo);

tabuleiro.addEventListener("pointerdown", acaoPrincipal);

document.addEventListener("keydown", function(evento){
	if (evento.code === "Space"){
		acaoPrincipal();
	}
	botaoMusica.blur();
});

botaoMusica.addEventListener("click", function(){
	if (musicaFundo.paused){
		musicaFundo.play();
		botaoMusica.textContent = "Desligar Música";
	} else {
		musicaFundo.pause();
		botaoMusica.textContent = "Ligar Música";
	}
});