import { useEffect, useMemo, useRef, useState } from 'react'
import './CandyCrushGame.css'
import PixelButton from '../../ui/PixelButton'

const BOARD_SIZE = 7
const TARGET_SCORE = 4000
const STARTING_MOVES = 30
const SWAP_ANIMATION_MS = 180
const CLEAR_ANIMATION_MS = 280
const DROP_ANIMATION_MS = 320
const SHAKE_ANIMATION_MS = 260

const candyTypes = [
  { id: 'heart', label: 'Coração de morango', emoji: '🍓', colorClass: 'candy-heart' },
  { id: 'flower', label: 'Flor de mel', emoji: '🌸', colorClass: 'candy-flower' },
  { id: 'cake', label: 'Fatia de bolo', emoji: '🍰', colorClass: 'candy-cake' },
  { id: 'cookie', label: 'Biscoito dourado', emoji: '🍪', colorClass: 'candy-cookie' },
  { id: 'wrap', label: 'Laço de festa', emoji: '🎀', colorClass: 'candy-wrap' },
  { id: 'star', label: 'Estrela de caramelo', emoji: '⭐', colorClass: 'candy-star' },
]

let candyIdSeed = 1

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration)
})

const randomCandyType = () => candyTypes[Math.floor(Math.random() * candyTypes.length)]

const createCandy = () => {
  const type = randomCandyType()

  return {
    id: candyIdSeed++,
    type: type.id,
  }
}

const getTypeInfo = (typeId) => candyTypes.find((type) => type.id === typeId) || candyTypes[0]

const createBoard = () => Array.from({ length: BOARD_SIZE * BOARD_SIZE }, createCandy)

const swapBoardValues = (board, firstIndex, secondIndex) => {
  const nextBoard = [...board]
  const temp = nextBoard[firstIndex]
  nextBoard[firstIndex] = nextBoard[secondIndex]
  nextBoard[secondIndex] = temp
  return nextBoard
}

const areAdjacent = (firstIndex, secondIndex) => {
  const firstRow = Math.floor(firstIndex / BOARD_SIZE)
  const firstCol = firstIndex % BOARD_SIZE
  const secondRow = Math.floor(secondIndex / BOARD_SIZE)
  const secondCol = secondIndex % BOARD_SIZE

  return (
    (Math.abs(firstRow - secondRow) === 1 && firstCol === secondCol)
    || (Math.abs(firstCol - secondCol) === 1 && firstRow === secondRow)
  )
}

const findMatches = (board) => {
  const matched = new Set()

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    let col = 0

    while (col < BOARD_SIZE) {
      const start = col
      const currentType = board[row * BOARD_SIZE + col]?.type

      while (
        col < BOARD_SIZE
        && board[row * BOARD_SIZE + col]?.type === currentType
      ) {
        col += 1
      }

      if (currentType && col - start >= 3) {
        for (let index = start; index < col; index += 1) {
          matched.add(row * BOARD_SIZE + index)
        }
      }

      if (start === col) {
        col += 1
      }
    }
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    let row = 0

    while (row < BOARD_SIZE) {
      const start = row
      const currentType = board[row * BOARD_SIZE + col]?.type

      while (
        row < BOARD_SIZE
        && board[row * BOARD_SIZE + col]?.type === currentType
      ) {
        row += 1
      }

      if (currentType && row - start >= 3) {
        for (let index = start; index < row; index += 1) {
          matched.add(index * BOARD_SIZE + col)
        }
      }

      if (start === row) {
        row += 1
      }
    }
  }

  return matched
}

const collapseBoard = (board, matchedIndexes) => {
  const nextBoard = Array.from({ length: BOARD_SIZE * BOARD_SIZE })

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    const survivingCells = []

    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
      const boardIndex = row * BOARD_SIZE + col
      const cell = matchedIndexes.has(boardIndex) ? null : board[boardIndex]

      if (cell) {
        survivingCells.push(cell)
      }
    }

    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
      const boardIndex = row * BOARD_SIZE + col
      nextBoard[boardIndex] = survivingCells.shift() || createCandy()
    }
  }

  return nextBoard
}

const settleBoard = (initialBoard) => {
  let currentBoard = initialBoard
  let clearedCount = 0
  let cascadeCount = 0

  while (true) {
    const matches = findMatches(currentBoard)

    if (matches.size === 0) {
      break
    }

    clearedCount += matches.size
    cascadeCount += 1
    currentBoard = collapseBoard(currentBoard, matches)
  }

  return {
    board: currentBoard,
    clearedCount,
    cascadeCount,
  }
}

const createStableBoard = () => settleBoard(createBoard()).board

export default function CandyCrushGame({ onBack }) {
  const [board, setBoard] = useState(() => createStableBoard())
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [score, setScore] = useState(0)
  const [movesLeft, setMovesLeft] = useState(STARTING_MOVES)
  const [phase, setPhase] = useState('playing')
  const [message, setMessage] = useState('Combine 3 ou mais doces para montar a mesa da mamãe.')
  const [animationState, setAnimationState] = useState({
    clearing: new Set(),
    swapping: new Set(),
    invalid: new Set(),
    isBusy: false,
    comboText: '',
  })
  const boardRef = useRef(board)

  useEffect(() => {
    boardRef.current = board
  }, [board])

  const selectedCandy = selectedIndex !== null ? board[selectedIndex] : null
  const progress = useMemo(() => Math.min(100, (score / TARGET_SCORE) * 100), [score])

  useEffect(() => {
    if (phase !== 'playing') {
      return
    }

    if (score >= TARGET_SCORE) {
      setPhase('won')
      setMessage('Mesa pronta! Você conseguiu reunir todas as doçuras do Dia das Mães.')
      return
    }

    if (movesLeft <= 0) {
      setPhase('lost')
      setMessage('Os movimentos acabaram. Tente de novo para preparar uma mesa ainda melhor.')
    }
  }, [score, movesLeft, phase])

  const restartGame = () => {
    candyIdSeed = 1
    const freshBoard = createStableBoard()
    boardRef.current = freshBoard
    setBoard(freshBoard)
    setSelectedIndex(null)
    setScore(0)
    setMovesLeft(STARTING_MOVES)
    setPhase('playing')
    setMessage('Combine 3 ou mais doces para montar a mesa da mamãe.')
    setAnimationState({
      clearing: new Set(),
      swapping: new Set(),
      invalid: new Set(),
      isBusy: false,
      comboText: '',
    })
  }

  const handleTileClick = async (index) => {
    if (phase !== 'playing' || animationState.isBusy) {
      return
    }

    const currentBoard = boardRef.current

    if (selectedIndex === null) {
      setSelectedIndex(index)
      setMessage(`Você escolheu ${getTypeInfo(currentBoard[index].type).label.toLowerCase()}.`)
      return
    }

    if (selectedIndex === index) {
      setSelectedIndex(null)
      setMessage('Seleção cancelada.')
      return
    }

    if (!areAdjacent(selectedIndex, index)) {
      setSelectedIndex(index)
      setMessage('Troque com uma peça vizinha para criar uma combinação.')
      return
    }

    const pair = new Set([selectedIndex, index])
    const swappedBoard = swapBoardValues(currentBoard, selectedIndex, index)
    const matches = findMatches(swappedBoard)

    setMovesLeft((currentMoves) => Math.max(0, currentMoves - 1))
    setSelectedIndex(null)
    setAnimationState({
      clearing: new Set(),
      swapping: pair,
      invalid: new Set(),
      isBusy: true,
      comboText: '',
    })
    setBoard(swappedBoard)
    boardRef.current = swappedBoard
    await wait(SWAP_ANIMATION_MS)

    if (matches.size === 0) {
      setAnimationState({
        clearing: new Set(),
        swapping: new Set(),
        invalid: pair,
        isBusy: true,
        comboText: '',
      })
      setMessage('Sem combinação. A troca voltou para o lugar.')
      await wait(SHAKE_ANIMATION_MS)
      setBoard(currentBoard)
      boardRef.current = currentBoard
      setAnimationState({
        clearing: new Set(),
        swapping: new Set(),
        invalid: new Set(),
        isBusy: false,
        comboText: '',
      })
      return
    }

    setAnimationState({
      clearing: matches,
      swapping: new Set(),
      invalid: new Set(),
      isBusy: true,
      comboText: `${matches.size} doces!`,
    })
    await wait(CLEAR_ANIMATION_MS)

    const settled = settleBoard(swappedBoard)
    const pointsEarned = settled.clearedCount * 20 + settled.cascadeCount * 40
    const comboText = settled.cascadeCount > 1
      ? `Combo x${settled.cascadeCount}! +${pointsEarned}`
      : `+${pointsEarned}`

    setBoard(settled.board)
    boardRef.current = settled.board
    setScore((currentScore) => currentScore + pointsEarned)
    setMessage(settled.cascadeCount > 1
      ? `Cascata doce! Você marcou ${pointsEarned} pontos.`
      : `Combo! Você marcou ${pointsEarned} pontos.`)
    setAnimationState({
      clearing: new Set(),
      swapping: new Set(),
      invalid: new Set(),
      isBusy: true,
      comboText,
    })
    await wait(DROP_ANIMATION_MS)
    setAnimationState({
      clearing: new Set(),
      swapping: new Set(),
      invalid: new Set(),
      isBusy: false,
      comboText: '',
    })
  }

  return (
    <div className="candy-crush-container bg-sky">
      <div className="candy-crush-shell pixel-border">
        <header className="candy-header">
          <div>
            <span className="pixel-font candy-kicker">Candy Crush 2.0</span>
            <h1 className="pixel-font candy-title">Dia das Mães</h1>
          </div>

          <div className="candy-header-stats">
            <div className="candy-stat">
              <span className="candy-stat-label">Score</span>
              <strong>{score}</strong>
            </div>
            <div className="candy-stat">
              <span className="candy-stat-label">Movimentos</span>
              <strong>{movesLeft}</strong>
            </div>
            <div className="candy-stat">
              <span className="candy-stat-label">Meta</span>
              <strong>{TARGET_SCORE}</strong>
            </div>
          </div>
        </header>

        <main className="candy-layout">
          <section className="candy-info-panel pixel-border">
            <p className="candy-section-label pixel-font">Objetivo</p>
            <p className="candy-instruction">
              {message}
            </p>

            <div className="candy-progress">
              <div className="candy-progress-bar">
                <div className="candy-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="candy-progress-text">{Math.round(progress)}% da meta</span>
            </div>

            <div className="candy-legend">
              <p className="candy-section-label pixel-font">Legenda</p>
              <div className="legend-list">
                {candyTypes.map((type) => (
                  <div key={type.id} className="legend-item">
                    <span className={`legend-candy ${type.colorClass}`}>{type.emoji}</span>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* {selectedCandy && (
              <div className="candy-selection-box">
                <p className="candy-section-label pixel-font">Seleção atual</p>
                <p className="candy-selection-name">{getTypeInfo(selectedCandy.type).label}</p>
                <p className="candy-selection-help">
                  {phase === 'playing'
                    ? 'Clique em um doce vizinho para trocar.'
                    : 'Abra novo jogo para continuar.'}
                </p>
              </div>
            )} */}
          </section>

          <section className="candy-board-panel pixel-border" aria-label="Tabuleiro de doces">
            {animationState.comboText && (
              <div className="candy-combo-pop pixel-font" aria-live="polite">
                {animationState.comboText}
              </div>
            )}

            <div
              className={`candy-board ${phase !== 'playing' ? 'finished' : ''} ${animationState.isBusy ? 'animating' : ''}`}
              role="grid"
            >
              {board.map((cell, index) => {
                const typeInfo = getTypeInfo(cell.type)
                const isSelected = selectedIndex === index
                const isClearing = animationState.clearing.has(index)
                const isSwapping = animationState.swapping.has(index)
                const isInvalid = animationState.invalid.has(index)
                const row = Math.floor(index / BOARD_SIZE) + 1
                const column = (index % BOARD_SIZE) + 1

                return (
                  <button
                    key={cell.id}
                    type="button"
                    className={`candy-tile ${typeInfo.colorClass} ${isSelected ? 'selected' : ''} ${isClearing ? 'clearing' : ''} ${isSwapping ? 'swapping' : ''} ${isInvalid ? 'invalid' : ''}`}
                    onClick={() => handleTileClick(index)}
                    aria-label={`${typeInfo.label}, linha ${row}, coluna ${column}`}
                    aria-pressed={isSelected}
                    disabled={phase !== 'playing' || animationState.isBusy}
                    style={{ '--tile-order': index }}
                  >
                    <span className="candy-emoji" aria-hidden="true">{typeInfo.emoji}</span>
                  </button>
                )
              })}
            </div>

            {phase !== 'playing' && (
              <div className="candy-result-banner">
                <p className="pixel-font candy-result-title">
                  {phase === 'won' ? 'Mesa pronta!' : 'Quase lá!'}
                </p>
                <p className="candy-result-text">
                  {phase === 'won'
                    ? 'Você venceu e deixou a celebração do Dia das Mães ainda mais doce.'
                    : 'Reinicie para buscar mais combinações e bater a meta.'}
                </p>
              </div>
            )}
          </section>
        </main>

        <footer className="candy-actions">
          <div className="candy-actions-left">
            <PixelButton onClick={restartGame} text="REINICIAR" />
            {typeof onBack === 'function' && (
              <button className="candy-back-button" type="button" onClick={onBack}>
                Voltar ao menu
              </button>
            )}
          </div>

          <div className="candy-footer-note">
            Dica: troque peças vizinhas para criar linhas de 3, 4 ou 5 doces.
          </div>
        </footer>
      </div>
    </div>
  )
}
