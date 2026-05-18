import { useState, useEffect } from 'react'
import pokemom from '../../data/pokemom.json'
import attacks from '../../data/attacks.json'
import dialogues from '../../data/dialogues.json'
import './Battle.css'
import PixelButton from '../ui/PixelButton'
import battleAvatar1 from '../../assets/pokemom/avatars/battle_avatar_mae_1.png'
import battleAvatar2 from '../../assets/pokemom/avatars/battle_avatar_mae_2.png'
import battleAvatar3 from '../../assets/pokemom/avatars/battle_avatar_mae_3.png'
import chineloImage from '../../assets/pokemom/monsters/chinelo_havaianas.png'
import guardaChuvaImage from '../../assets/pokemom/monsters/guarda_chuva.png'
import cintaDeCouroImage from '../../assets/pokemom/monsters/cinta_de_couro.png'
import carameloImage from '../../assets/pokemom/monsters/caramelo.png'
import particleAttackImage from '../../assets/pokemom/effects/particle_attack.png'

const battleAvatarById = {
  1: battleAvatar1,
  2: battleAvatar2,
  3: battleAvatar3,
}

const pokemonImageById = {
  1: chineloImage,
  2: guardaChuvaImage,
  3: cintaDeCouroImage,
  4: carameloImage,
}

export default function Battle({ enemy, onBattleEnd }) {
  // O pokemom do player é sempre o Caramelo
  const playerPokemon = pokemom.find(mon => mon.id === 4 || mon.name === 'Caramelo')
  const enemyPokemon = enemy.pokemonData
    || pokemom.find(mon => mon.id === enemy.pokemon)
    || pokemom[0]

  // Attacks for each pokemon
  const getAttacksForPokemon = (pokemonId) => attacks.filter(attack => attack.pokemonId === pokemonId)

  const playerAttacks = getAttacksForPokemon(playerPokemon.id)
  const enemyAttacks = getAttacksForPokemon(enemyPokemon.id)

  // State
  const [playerHp, setPlayerHp] = useState(playerPokemon.maxHp)
  const [enemyHp, setEnemyHp] = useState(enemyPokemon.maxHp)
  const [battleLog, setBattleLog] = useState([
    `Você enviou ${playerPokemon.name}!`,
    `${enemy.name} enviou ${enemyPokemon.name}!`
  ])
  const [selectedAttack, setSelectedAttack] = useState(playerAttacks[0])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [battleAnimating, setBattleAnimating] = useState(false)

  // Check game over
  useEffect(() => {
    if (playerHp <= 0) {
      setGameOver(true)
      setWinner('enemy')
      setBattleLog(prev => [...prev, `${playerPokemon.name} foi derrotado!`, enemy.winDialogue])
    } else if (enemyHp <= 0) {
      setGameOver(true)
      setWinner('player')
      setBattleLog(prev => [...prev, `${enemyPokemon.name} foi derrotado!`, enemy.loseDialogue])
    }
  }, [playerHp, enemyHp])

  const getRandomDialogue = (category) => {
    const dialogueOptions = dialogues[enemy.id][category]
    return dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)]
  }

  const calculateDamage = (attacker, attack) => {
    const variance = 0.85 + Math.random() * 0.3 // 85-115%
    const baseDamage = attack.damage * (attacker.attack / 100)
    const accuracy = attack.accuracy / 100
    const hit = Math.random() < accuracy
    return {
      damage: Math.round(baseDamage * variance),
      hit
    }
  }

  const getHpPercent = (currentHp, maxHp) => Math.max(0, Math.min(100, (currentHp / maxHp) * 100))

  const getHpTone = (currentHp, maxHp) => {
    const percent = getHpPercent(currentHp, maxHp)
    if (percent <= 25) return 'danger'
    if (percent <= 50) return 'warning'
    return 'healthy'
  }

  const renderBattleHud = (pokemonData, currentHp, side) => (
    <div className={`pokemon-hud pokemon-hud-${side}`}>
      <div className="hud-topline">
        <span className="hud-name">{pokemonData.name}</span>
        <span className="hud-level">Nv. {pokemonData.level || 50}</span>
      </div>
      <div className="hud-hp-row">
        <span className="hud-hp-label">HP</span>
        <div className="hud-hp-track">
          <div
            className={`hud-hp-fill ${getHpTone(currentHp, pokemonData.maxHp)}`}
            style={{ width: `${getHpPercent(currentHp, pokemonData.maxHp)}%` }}
          />
        </div>
      </div>
      <div className="hud-hp-numbers">
        {Math.max(0, currentHp)} / {pokemonData.maxHp}
      </div>
    </div>
  )

  const handlePlayerAttack = (attack) => {
    if (battleAnimating || !isPlayerTurn) return

    setBattleAnimating(true)
    setSelectedAttack(attack)

    // Player attack
    const { damage, hit } = calculateDamage(playerPokemon, attack)
    let log = [...battleLog]

    if (hit) {
      setEnemyHp(prev => Math.max(0, prev - damage))
      log.push(`${playerPokemon.name} usou ${attack.name}! ${attack.art}`)
      log.push(`Acertou! Causou ${damage} de dano!`)
    } else {
      log.push(`${playerPokemon.name} usou ${attack.name}! ${attack.art}`)
      log.push(`Errou o ataque!`)
    }

    setBattleLog(log)

    // Enemy turn after delay
    setTimeout(() => {
      if (enemyHp - damage > 0) {
        const enemyAttack = enemyAttacks[Math.floor(Math.random() * enemyAttacks.length)]
        const enemyDamage = calculateDamage(enemyPokemon, enemyAttack)

        let log2 = [...log, getRandomDialogue('beforeAttack')]

        if (enemyDamage.hit) {
          setPlayerHp(prev => Math.max(0, prev - enemyDamage.damage))
          log2.push(`${enemyPokemon.name} usou ${enemyAttack.name}! ${enemyAttack.art}`)
          log2.push(`Acertou! Causou ${enemyDamage.damage} de dano!`)
        } else {
          log2.push(`${enemyPokemon.name} usou ${enemyAttack.name}! ${enemyAttack.art}`)
          log2.push(`Errou o ataque!`)
        }

        setBattleLog(log2)
      }

      setBattleAnimating(false)
      setIsPlayerTurn(true)
    }, 1500)

    setIsPlayerTurn(false)
  }

  const handleReturn = () => {
    onBattleEnd()
  }

  return (
    <div className="battle-container bg-grass">
      <div className="battle-content pokemon-battle-shell">
        <div className="battle-header pixel-border">
          <div className="enemy-trainer-card">
            <img className="trainer-avatar" src={battleAvatarById[enemy.id]} alt={enemy.name} />
            <div>
              <p className="battle-challenger-label">Desafiante</p>
              <h2 className="battle-trainer-name">{enemy.name}</h2>
              <p className="battle-trainer-dialogue">“{enemy.winDialogue}”</p>
            </div>
          </div>

          <div className="battle-status-card">
            <span className="status-chip">Duelo do Dia das Mães</span>
            <span className={`turn-chip ${isPlayerTurn && !gameOver ? 'active' : ''}`}>
              {gameOver ? 'Fim da batalha' : isPlayerTurn ? 'Sua vez' : 'Vez da mãe'}
            </span>
          </div>
        </div>

        <div className="battle-stage pixel-border">
          <div className="battle-sky" />
          <div className="battle-ground" />

          {renderBattleHud(enemyPokemon, enemyHp, 'enemy')}
          {renderBattleHud(playerPokemon, playerHp, 'player')}

          <div className="battle-platform battle-platform-enemy" />
          <div className="battle-platform battle-platform-player" />

          <div className="battle-mon battle-mon-enemy">
            <img
              className="pokemon-image enemy-pokemon-image"
              src={pokemonImageById[enemyPokemon.id]}
              alt={enemyPokemon.name}
            />
          </div>

          <div className="battle-mon battle-mon-player">
            <img
              className="pokemon-image player-pokemon-image"
              src={pokemonImageById[playerPokemon.id]}
              alt={playerPokemon.name}
            />
          </div>

          <div className="battle-log pixel-border">
            <div className="log-content">
              {battleLog.slice(-2).map((msg, idx) => {
                const isPlayer = msg.includes(playerPokemon.name)

                return (
                  <p
                    key={idx}
                    className={`log-message ${isPlayer ? 'log-message-player' : 'log-message-enemy'
                      }`}
                  >
                    {isPlayer ? '- ' : ''}
                    {msg}
                    {!isPlayer ? ' -' : ''}
                  </p>
                )
              })}
            </div>
          </div>
        </div>

        {battleAnimating && (
          <div className="attack-effect" aria-hidden="true">
            <img className="attack-effect-image" src={particleAttackImage} alt="" />
          </div>
        )}

        <div className="command-panel pixel-border">
          <div className="command-panel-info">
            <div className="command-title-row">
              <p className="command-title">
                {gameOver ? 'A batalha acabou!' : battleAnimating ? 'Aguarde...' : 'O que você vai fazer?'}
              </p>
              <span className={`command-state ${battleAnimating ? 'busy' : ''}`}>
                {battleAnimating ? 'Animando' : isPlayerTurn ? 'Lutar' : 'Espera'}
              </span>
            </div>
            <p className="command-description">
              {selectedAttack
                ? `${selectedAttack.name} • Poder ${selectedAttack.damage} • Precisão ${selectedAttack.accuracy}%`
                : 'Escolha um golpe para ver os detalhes.'}
            </p>
          </div>

          {!gameOver ? (
            <div className="attacks-grid" aria-label="Golpes disponíveis">
              {playerAttacks.map(attack => (
                <button
                  key={attack.id}
                  type="button"
                  className="attack-option"
                  onClick={() => handlePlayerAttack(attack)}
                  disabled={!isPlayerTurn || battleAnimating}
                >
                  <span className="attack-name">{attack.name}</span>
                  <span className="attack-meta">PWR {attack.damage} · ACC {attack.accuracy}%</span>
                  <span className="attack-description">{attack.description}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="game-over-container">
              <div className="game-over-text">
                {winner === 'player' ? '🎉 VOCÊ VENCEU! 🎉' : '💔 VOCÊ PERDEU! 💔'}
              </div>
              <PixelButton onClick={handleReturn} text="VOLTAR" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
