import { useMemo, useState } from 'react'
import enemies from '../../data/enemies.json'
import pokemom from '../../data/pokemom.json'
import './EnemySelection.css'
import PixelButton from '../ui/PixelButton'
import profileAvatar1 from '../../assets/pokemom/avatars/profile_avatar_mae_1.png'
import profileAvatar2 from '../../assets/pokemom/avatars/profile_avatar_mae_2.png'
import profileAvatar3 from '../../assets/pokemom/avatars/profile_avatar_mae_3.png'
import chineloImage from '../../assets/pokemom/monsters/chinelo_havaianas.png'
import guardaChuvaImage from '../../assets/pokemom/monsters/guarda_chuva.png'
import cintaDeCouroImage from '../../assets/pokemom/monsters/cinta_de_couro.png'
import carameloImage from '../../assets/pokemom/monsters/caramelo.png'

const enemyAvatarById = {
  1: profileAvatar1,
  2: profileAvatar2,
  3: profileAvatar3,
}

const pokemomImageById = {
  1: chineloImage,
  2: guardaChuvaImage,
  3: cintaDeCouroImage,
  4: carameloImage,
}

const stageThemeByType = {
  disciplina: 'stage-theme-disciplina',
  proteção: 'stage-theme-protecao',
  lendário: 'stage-theme-lendario',
  'vira-lata': 'stage-theme-viralata',
}

const difficultyLabel = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

export default function EnemySelection({ onEnemySelected, onBack }) {
  const firstEnemyId = enemies[0]?.id ?? null
  const [selectedId, setSelectedId] = useState(firstEnemyId)

  const rivals = useMemo(() => {
    return enemies.map(enemy => ({
      ...enemy,
      pokemonData: pokemom.find(p => p.id === enemy.pokemon),
    }))
  }, [])

  const selectedEnemy = rivals.find(enemy => enemy.id === selectedId) || rivals[0]
  const selectedEnemyMon = selectedEnemy?.pokemonData
  const stageThemeClass = selectedEnemyMon
    ? stageThemeByType[selectedEnemyMon.type] || 'stage-theme-default'
    : 'stage-theme-default'

  const handleSelect = (enemy) => {
    setSelectedId(enemy.id)
  }

  const handleConfirm = () => {
    if (!selectedEnemy) return
    onEnemySelected(selectedEnemy)
  }

  const handleKeyDown = (event, enemy) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect(enemy)
    }
  }

  return (
    <div className="enemy-selection-container bg-sky">
      <div className="pokemon-selection-screen">
        <header className="selection-header">
          <span className="pixel-font header-kicker">Poke MOM Battle</span>
          <h1 className="pixel-font title">Escolha seu rival!</h1>
        </header>

        <main className="trainer-select-layout">
          <section className="trainer-list-panel pixel-border" aria-label="Lista de rivais">
            <div className="panel-label pixel-font">Treinadores</div>

            <div className="trainer-list">
              {rivals.map(enemy => {
                const isSelected = selectedId === enemy.id

                return (
                  <button
                    key={enemy.id}
                    className={`trainer-row ${isSelected ? 'selected' : ''}`}
                    type="button"
                    onClick={() => handleSelect(enemy)}
                    onKeyDown={(event) => handleKeyDown(event, enemy)}
                    aria-pressed={isSelected}
                  >
                    <span className="trainer-cursor pixel-font">▶</span>
                    <span className="trainer-mini-avatar">
                      <img
                        src={enemyAvatarById[enemy.id]}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                    <span className="trainer-row-info">
                      <span className="pixel-font trainer-name">{enemy.name}</span>
                      <span className="trainer-partner">
                        Parceiro: {enemy.pokemonData?.name || '???'}
                      </span>
                    </span>
                    <span className={`difficulty-badge ${enemy.difficulty}`}>
                      {difficultyLabel[enemy.difficulty] || enemy.difficulty}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="trainer-preview-panel" aria-live="polite">
            <div className={`battle-stage pixel-border ${stageThemeClass}`}>
              {selectedEnemyMon && (
                <aside className="selected-mon-card pixel-border" aria-label="Dados do pokemom selecionado">
                  <p className="selected-mon-title">Pokemom da {selectedEnemy.name}</p>
                  <p className="selected-mon-name">{selectedEnemyMon.name}</p>
                  <p className="selected-mon-meta">
                    Tipo {selectedEnemyMon.type} · Nv {selectedEnemyMon.level || 1}
                  </p>
                  <p className="selected-mon-stats">
                    HP {selectedEnemyMon.maxHp} · ATK {selectedEnemyMon.attack} · DEF {selectedEnemyMon.defense}
                  </p>
                </aside>
              )}

              {selectedEnemyMon && (
                <div className="stage-theme-label">
                  Habitat: {selectedEnemyMon.type}
                </div>
              )}

              <div className="stage-platform mon-platform" />
              <div className={`selected-trainer-sprite ${selectedEnemyMon?.id === 3 ? 'mon-cinta' : ''}`}>
                {selectedEnemyMon && (
                  <img
                    className="enemy-mon-image"
                    src={pokemomImageById[selectedEnemyMon.id]}
                    alt={selectedEnemyMon.name}
                  />
                )}
              </div>
            </div>

            <div className="pokemon-dialog pixel-border">
              <p className="pixel-font dialog-title">
                {selectedEnemy ? `${selectedEnemy.name} quer batalhar!` : 'Escolha um rival.'}
              </p>
              <p className="dialog-text">
                {selectedEnemy
                  ? `Vai usar ${selectedEnemy.pokemonData?.name || 'um pokemom misterioso'} como parceiro.`
                  : 'Selecione um treinador na lista para ver os detalhes.'}
              </p>
            </div>
          </section>
        </main>

        <footer className="selection-actions">
          <div className="selection-left-actions">
            <div className="hint-box pixel-border">
              <span className="pixel-font">A</span> selecionar · <span className="pixel-font">START</span> desafiar
            </div>

            {typeof onBack === 'function' && (
              <button
                className="back-to-games-button"
                type="button"
                onClick={onBack}
              >
                Voltar ao menu de jogos
              </button>
            )}
          </div>

          <PixelButton
            onClick={handleConfirm}
            disabled={!selectedEnemy}
            text="DESAFIAR"
          />
        </footer>
      </div>
    </div>
  )
}
