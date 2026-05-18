import { useState } from 'react'
import './App.css'
import EnemySelection from './components/pokemom/EnemySelection'
import Battle from './components/pokemom/Battle'
import GameSelection from './components/menu/GameSelection'
import CandyCrushGame from './components/games/candy-crush/CandyCrushGame'

function App() {
  const [screen, setScreen] = useState('game-menu') // 'game-menu' | 'selection' | 'battle'
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedEnemy, setSelectedEnemy] = useState(null)

  const handleGameSelected = (gameId) => {
    setSelectedGame(gameId)

    if (gameId === 'pokemom') {
      setScreen('selection')
      return
    }

    if (gameId === 'candy-crush-20') {
      setScreen('candy-crush')
    }
  }

  const handleEnemySelected = (enemy) => {
    setSelectedEnemy(enemy)
    setScreen('battle')
  }

  const handleBattleEnd = () => {
    setScreen('selection')
    setSelectedEnemy(null)
  }

  const handleBackToGames = () => {
    setScreen('game-menu')
    setSelectedEnemy(null)
  }

  return (
    <div className="app">
      {screen === 'game-menu' && (
        <GameSelection onGameSelected={handleGameSelected} />
      )}
      {screen === 'selection' && selectedGame === 'pokemom' && (
        <EnemySelection
          onEnemySelected={handleEnemySelected}
          onBack={handleBackToGames}
        />
      )}
      {screen === 'battle' && selectedEnemy && (
        <Battle enemy={selectedEnemy} onBattleEnd={handleBattleEnd} />
      )}
      {screen === 'candy-crush' && (
        <CandyCrushGame onBack={handleBackToGames} />
      )}
    </div>
  )
}

export default App
