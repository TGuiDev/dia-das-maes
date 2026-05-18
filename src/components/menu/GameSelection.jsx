import './GameSelection.css'
import PixelButton from '../ui/PixelButton'

const games = [
  {
    id: 'pokemom',
    title: 'Poke MOM Battle',
    subtitle: 'Batalha tática já disponível',
    description: 'Escolha um rival e comece sua batalha agora.',
    status: 'available',
  },
  {
    id: 'candy-crush-20',
    title: 'Candy Crush 2.0',
    subtitle: 'Doçuras do Dia das Mães',
    description: 'Combine doces e monte a mesa perfeita para a mamãe.',
    status: 'available',
  },
  {
    id: 'yard-defense',
    title: 'Em Breve',
    subtitle: '',
    description: '',
    status: 'soon',
  },
]

export default function GameSelection({ onGameSelected }) {
  return (
    <div className="game-selection-container bg-sky" style={{ height: '100vh' }}>
      <div className="game-selection-screen pixel-border">
        <header className="game-selection-header">
          <span className="pixel-font game-kicker">Mães Arcade</span>
          <h1 className="pixel-font game-title">Selecione um jogo</h1>
          <p className="game-subtitle">
            Hoje temos dois jogos disponiveis e espaco preparado para os proximos.
          </p>
        </header>

        <main className="game-grid" aria-label="Jogos disponiveis">
          {games.map((game) => {
            const isAvailable = game.status === 'available'

            return (
              <article
                key={game.id}
                className={`game-card ${isAvailable ? 'available' : 'soon'}`}
                aria-label={game.title}
              >
                <div className="game-card-top">
                  <span className={`game-badge ${isAvailable ? 'available' : 'soon'}`}>
                    {isAvailable ? 'Disponivel' : 'Em breve'}
                  </span>
                  <h2 className="pixel-font game-card-title">{game.title}</h2>
                  <p className="game-card-description">{game.description}</p>
                </div>

                {isAvailable ? (
                  <PixelButton
                    onClick={() => onGameSelected(game.id)}
                    text="JOGAR"
                    subtitle={game.subtitle}
                  />
                ) : (
                  <button className="coming-soon-button" type="button" disabled>
                    <span className="pixel-font">EM BREVE</span>
                    <span>{game.subtitle}</span>
                  </button>
                )}
              </article>
            )
          })}
        </main>
      </div>
    </div>
  )
}
