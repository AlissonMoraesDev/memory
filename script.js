// Variáveis de estado do jogo
let flippedCards = [] // Array que armazena as cartas viradas e sempre terá no máximo 2.
let matchedPairs = 0 // Contador de pares encontrados.
let attempts = 0 // Contador de tentativas do jogador.
let isCheckingPair = false // Trava o jogo enquanto valida o par ou esconde as cartas.

// Array com todas as cartas do jogo
const cardItems = [
  { id: 1, content: '🚀', matched: false },
  { id: 2, content: '🚀', matched: false },
  { id: 3, content: '🚔', matched: false },
  { id: 4, content: '🚔', matched: false },
  { id: 5, content: '🚦', matched: false },
  { id: 6, content: '🚦', matched: false },
  { id: 7, content: '🎲', matched: false },
  { id: 8, content: '🎲', matched: false },
  { id: 9, content: '🧃', matched: false },
  { id: 10, content: '🧃', matched: false },
  { id: 11, content: '🌎', matched: false },
  { id: 12, content: '🌎', matched: false },
  { id: 13, content: '🍄', matched: false },
  { id: 14, content: '🍄', matched: false },
  { id: 15, content: '🐳', matched: false },
  { id: 16, content: '🐳', matched: false },
]

// A função que embaralha as cartas
function shuffleCards(array) {
  // Se o valor é depois e negativo vai antes.
  const shuffled = array.sort(() => (Math.random() > 0.5 ? 1 : -1))

  return shuffled
}

// Crie o card individualmente
function createCard(card) {
  // Cria o elemento principal da carta
  const cardElement = document.createElement('div')
  cardElement.className = 'card'
  // cardElement.classList.add('revealed')

  // Cria o elemento do emoji
  const emoji = document.createElement('span')
  emoji.className = 'card-emoji'
  emoji.textContent = card.content

  // Adiciona o emoji ao card
  cardElement.appendChild(emoji)

  // Adiciona o evento de clique na carta
  cardElement.addEventListener('click', () =>
    handleCardClick(cardElement, card)
  )

  return cardElement
}

// Renderiza todos os cards na tela
function renderCards() {
  const deck = document.getElementById('deck')
  deck.innerHTML = ''

  const cards = shuffleCards(cardItems)
  cards.forEach(card => {
    const cardElement = createCard(card)
    deck.appendChild(cardElement)
  })
}

function handleCardClick(cardElement, card) {
  if (
    isCheckingPair || // Ignora o clique enquanto verifica o par.
    cardElement.classList.contains('revealed') // Ignora o clique se a carta já estiver virada.
  ) {
    return
  }
  // Revelar a carta
  cardElement.classList.add('revealed')

  // Adiciona no array as cartas que estão viradas
  flippedCards.push({ cardElement, card })

  // Verificando se é a segunda carta virada
  if (flippedCards.length === 2) {
    // Atualiza para verdadeiro e sinalizar que vamos verificar o par.
    isCheckingPair = true
    // Incrementa o contador de tentativas.
    attempts++

    // Selecionar as cartas que estão viradas
    const [firstCard, secondCard] = flippedCards

    // Verificando se as cartas formam um par
    if (firstCard.card.content === secondCard.card.content) {
      // Incrementa pares encontrados.
      matchedPairs++

      // Marcar as cartas como encontradas
      cardItems.forEach(card => {
        if (card.content === firstCard.card.content) {
          card.matched = true
        }
      })

      // Limpa as cartas viradas
      flippedCards = []
      // Libera a próxima roda
      isCheckingPair = false
      // Atualiza o placar
      updaateStatus()

      const toFind = cardItems.find(card => card.matched === false)

      if (!toFind) {
        endGame()
      }
    } else {
      setTimeout(() => {
        firstCard.cardElement.classList.remove('revealed')
        secondCard.cardElement.classList.remove('revealed')

        flippedCards = []
        isCheckingPair = false
        updaateStatus()
      }, 700)
    }
  }
}

// Atualização de status da ação.
function updaateStatus() {
  document.getElementById(
    'stats'
  ).textContent = `${matchedPairs} acertos de ${attempts} tentativas`
}

// Função que reinicia as jogadas
function resetGame() {
  flippedCards = []
  matchedPairs = 0
  attempts = 0
  isCheckingPair = false

  // Desmarcar todas as cartas
  cardItems.forEach(card => (card.matched = false))

  // Remove o modal de parabéns na tela.
  modal.classList.remove('active')

  // Renderiza novamente e atualizar o placar
  renderCards()
  updaateStatus()
}

// Inicia o game
function initGame() {
  renderCards()

  // Adiciona o evento de reiniciar o jogo no botão
  document.getElementById('restart').addEventListener('click', resetGame)
}

// Modal de parabéns
let modal = document.getElementById('modal')
// Seleciona o botão de encerrar o jogo
let button = document.getElementById('button-end-game')

// Apresenta mensagem de parabenização.
function endGame() {
  modal.classList.add('active')
  button.addEventListener('click', resetGame)
}

initGame()
