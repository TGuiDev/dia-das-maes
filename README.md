# Arcade Mom

Arcade Mom é um arcade em navegador com visual pixel-art e tema de Dia das Mães, feito com React + Vite. O app começa em um menu de jogos e hoje oferece duas experiências jogáveis:

- **Poke MOM Battle**: batalha por turnos inspirada em jogos clássicos de monstros.
- **Candy Crush 2.0**: puzzle de combinar doces em um tabuleiro 7x7.

## Vídeo de apresentação

<video src="src/assets/apresentacao.mp4" controls width="100%">
  Seu navegador não suporta a reprodução de vídeo.
</video>


## Recursos

- Menu inicial para seleção de jogos.
- Interface responsiva para desktop e mobile.
- Estética pixel-art com a fonte retro `Press Start 2P`.
- Componentes organizados por domínio: menu, pokemom, jogos e UI reutilizável.
- Dados de personagens, inimigos, ataques e diálogos em arquivos JSON.
- Assets locais para avatares, monstros e efeitos visuais.

## Jogos disponíveis

### Poke MOM Battle

Fluxo principal:

1. Escolha **Poke MOM Battle** no menu.
2. Selecione uma rival entre as treinadoras disponíveis.
3. Enfrente a rival em uma batalha por turnos usando o Caramelo como parceiro.

O modo de batalha inclui:

- Seleção de rival com prévia do pokemom adversário.
- HUD com nome, nível, HP atual e barra de vida.
- Sistema de golpes com dano, precisão e descrição.
- Turno automático da inimiga após o ataque do jogador.
- Log de combate e mensagens de vitória/derrota.
- Efeito visual simples durante ataques.

O jogador sempre usa o **Caramelo**. As rivais usam pokemom definidos em `src/data/enemies.json`.

### Candy Crush 2.0

Fluxo principal:

1. Escolha **Candy Crush 2.0** no menu.
2. Troque doces vizinhos para formar linhas ou colunas de 3 ou mais peças iguais.
3. Alcance a meta de pontos antes que os movimentos acabem.

Configurações atuais:

- Tabuleiro: `7x7`.
- Meta: `4000` pontos.
- Movimentos iniciais: `30`.
- Pontuação por doces removidos e bônus por cascatas.
- Animações para troca, erro, remoção e queda das peças.
- Botão para reiniciar e botão para voltar ao menu.

## Pré-requisitos

- Node.js 18 ou superior.
- npm.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <repo-url>
cd nome_do_projeto
npm install
```

## Scripts

```bash
npm run dev
```

Inicia o servidor de desenvolvimento do Vite.

```bash
npm run build
```

Gera a versão de produção em `dist/`.

```bash
npm run preview
```

Pré-visualiza localmente o build gerado.

## Estrutura do projeto

```text
.
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx
    ├── main.jsx
    ├── App.css
    ├── index.css
    ├── assets
    │   └── pokemom
    │       ├── avatars
    │       ├── effects
    │       └── monsters
    ├── components
    │   ├── games
    │   │   └── candy-crush
    │   ├── menu
    │   ├── pokemom
    │   └── ui
    └── data
        ├── attacks.json
        ├── dialogues.json
        ├── enemies.json
        └── pokemom.json
```

## Dados do jogo

- `src/data/pokemom.json`: define os pokemom, tipos, níveis, HP, ataque, defesa e descrições.
- `src/data/enemies.json`: define as rivais, dificuldade, pokemom usado e falas de vitória/derrota.
- `src/data/attacks.json`: define os ataques disponíveis por pokemom.
- `src/data/dialogues.json`: define falas usadas durante a batalha.

## Assets

Os assets do modo Poke MOM ficam em `src/assets/pokemom/`:

- `avatars/`: avatares de perfil e batalha das rivais.
- `monsters/`: imagens dos pokemom.
- `effects/`: partículas e efeitos de ataque.

Ao adicionar um novo pokemom ou rival, atualize também os imports e mapas de imagem nos componentes que renderizam esses assets.

## Desenvolvimento

- Entrada do app: `src/main.jsx`.
- Controle das telas: `src/App.jsx`.
- Menu de jogos: `src/components/menu/GameSelection.jsx`.
- Seleção de rivais: `src/components/pokemom/EnemySelection.jsx`.
- Batalha: `src/components/pokemom/Battle.jsx`.
- Puzzle de doces: `src/components/games/candy-crush/CandyCrushGame.jsx`.
- Botão reutilizável: `src/components/ui/PixelButton.jsx`.

## Dicas para contribuir

- Mantenha componentes e CSS próximos ao domínio que eles representam.
- Coloque novos assets dentro de `src/assets/` seguindo a organização atual.
- Use os JSONs em `src/data/` para conteúdo editável do jogo.
- Teste as telas principais em desktop e mobile antes de abrir PR.
- Rode `npm run build` para validar o build de produção.

## Licença

Este projeto está licenciado sob MIT. Veja o arquivo `LICENSE` para mais detalhes.
