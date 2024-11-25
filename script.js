let questions = [];
let currentQuestionIndex = 0;
let totalPrize = 0;
let currentGameQuestions = [];
let playerName = "";

// Prêmios fixos para cada pergunta, totalizando 1 milhão
const prizeValues = [10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000];

// Seleciona os elementos do DOM
const playerImage = document.getElementById('playerImage');
const questionerImage = document.getElementById('questionerImage');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('nextButton');
const prizeElement = document.getElementById('prize');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('start-screen');
const introScreen = document.getElementById('intro-screen');
const nameScreen = document.getElementById('name-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('startButton');
const continueButton = document.getElementById('continueButton');
const confirmNameButton = document.getElementById('confirmNameButton');
const playerNameInput = document.getElementById('playerNameInput');
const playerNameDisplay = document.getElementById('playerName');
const scoreElement = document.getElementById('score');
const congratulationsScreen = document.getElementById('congratulations-screen');
const finalPlayerName = document.getElementById('finalPlayerName');
const finalScore = document.getElementById('finalScore');
const restartGameButton = document.getElementById('restartGameButton');
const emojiContainer = document.getElementById('emoji-container');

playerImage.src = 'imagens/bolsonaro.jpg';
questionerImage.src = 'imagens/lula.jpg';

// Função para carregar as perguntas do JSON
function loadQuestions() {
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o JSON: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data)) {
                throw new Error("Formato inesperado de dados JSON.");
            }
            questions = data;
            console.log("Perguntas carregadas com sucesso:", questions);
            startNewGame();
        })
        .catch(error => {
            console.error('Erro ao carregar as perguntas:', error);
            alert('Não foi possível carregar as perguntas. Verifique o console para mais detalhes.');
        });
}

// Inicia uma nova partida
function startNewGame() {
    if (questions.length === 0) {
        console.error("Nenhuma pergunta disponível para iniciar o jogo.");
        return;
    }
    currentGameQuestions = getRandomQuestions(10);
    currentQuestionIndex = 0;
    totalPrize = 0;
    prizeElement.textContent = `Prêmio Atual: R$ ${prizeValues[currentQuestionIndex]}`;
    scoreElement.textContent = `Pontuação: R$ ${totalPrize}`;
    restartButton.style.display = 'none';
    congratulationsScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    emojiContainer.style.display = 'none';
    loadQuestion();
}

// Seleciona 10 perguntas aleatórias para cada partida
function getRandomQuestions(count) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Carrega a pergunta atual na interface
function loadQuestion() {
    const currentQuestion = currentGameQuestions[currentQuestionIndex];
    if (!currentQuestion) {
        console.error("Erro: Pergunta não encontrada.");
        return;
    }
    questionElement.textContent = currentQuestion.question;
    answersElement.innerHTML = '';

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersElement.appendChild(button);
    });

    nextButton.style.display = 'none';
    prizeElement.textContent = `Prêmio Atual: R$ ${prizeValues[currentQuestionIndex]}`;
}

// Manipula a resposta do jogador
function selectAnswer(index) {
    questionerImage.src = 'imagens/lularindo.gif';

    const answerButtons = answersElement.querySelectorAll('button');
    answerButtons.forEach(button => button.disabled = true);

    const currentQuestion = currentGameQuestions[currentQuestionIndex];

    if (index === currentQuestion.correct) {
        totalPrize += prizeValues[currentQuestionIndex];
        prizeElement.textContent = `Prêmio Atual: R$ ${prizeValues[currentQuestionIndex]}`;
        scoreElement.textContent = `Pontuação: R$ ${totalPrize}`;
        alert("Resposta correta!");
        playerImage.src = 'imagens/bolsonarofeliz.gif';
    } else {
        alert("Resposta errada!");
        playerImage.src = 'imagens/bolsonarochorando.gif';
    }

    setTimeout(() => {
        resetImages();
        currentQuestionIndex++;
        if (currentQuestionIndex < currentGameQuestions.length) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

// Finaliza o jogo e exibe a tela de congratulações com emojis animados
function endGame() {
    finalPlayerName.textContent = playerName;
    finalScore.textContent = totalPrize;
    gameScreen.style.display = 'none';
    congratulationsScreen.style.display = 'flex';
    emojiContainer.style.display = 'block';

    // Define os emojis conforme o valor do prêmio
    const emojis = totalPrize >= 500000 ? ["👏", "🔥"] : ["😢"];
    animateEmojis(emojis);
}

// Função para criar e animar emojis
function animateEmojis(emojis) {
    emojiContainer.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const emoji = document.createElement('span');
        emoji.className = 'emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + "vw";
        emoji.style.animationDuration = Math.random() * 2 + 3 + "s";
        emojiContainer.appendChild(emoji);
    }
}

// Reseta as imagens para o estado original
function resetImages() {
    playerImage.src = 'imagens/bolsonaro.jpg';
    questionerImage.src = 'imagens/lula.jpg';
}

// Mostra a tela de introdução após o clique no botão "Iniciar Jogo"
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    introScreen.style.display = 'flex';
});

// Mostra a tela para inserir o nome do jogador após o clique no botão "Continuar"
continueButton.addEventListener('click', () => {
    introScreen.style.display = 'none';
    nameScreen.style.display = 'flex';
});

// Confirma o nome e começa o jogo
confirmNameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || "Jogador";
    playerNameDisplay.textContent = playerName;
    nameScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    loadQuestions();
});

// Reinicia o jogo ao clicar no botão da tela de congratulações
restartGameButton.addEventListener('click', () => {
    startNewGame();
});

