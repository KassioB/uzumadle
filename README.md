# Uzumadle

Jogo de adivinhar personagens do universo Naruto, no estilo Wordle. Feito com React, TypeScript, Vite e Tailwind CSS.

## Como rodar

```bash
npm install
npm run dev       # http://localhost:5174
npm run build     # checa os tipos e gera build/
npm run preview   # serve o build
```

## Modos

- **Diário:** o personagem do dia sai de uma semente baseada na data local. A lista é embaralhada por ciclo, então ninguém repete até todos terem saído. Os chutes e a sequência de vitórias ficam no `localStorage` (prefixo `ninjadle-`), e o dia vira sozinho à meia-noite.
- **Infinito:** sorteia um personagem aleatório; ao acertar aparece o botão "Próximo personagem".

## Pistas

Cada palpite mostra **Gênero, Afiliação, Clã, Elemento, Estreia, Atributos e Tipo de jutsu**.

| Cor      | Significado                                                       |
| -------- | ----------------------------------------------------------------- |
| Verde    | Igual                                                             |
| Amarelo  | Parcial: listas com algo em comum (a estreia é só certa ou errada) |
| Vermelho | Nada em comum                                                     |

Na coluna **Estreia**, a seta diz se o personagem certo estreou depois (↑) ou antes (↓).

**Gênero** mostra o símbolo ♂ ou ♀ junto do texto. **Elemento** mostra os selos com o kanji de cada natureza (火 Fogo, 風 Vento, 雷 Raio, 土 Terra, 水 Água): o nome aparece ao passar o mouse e é lido pelos leitores de tela.

A coluna **Atributos** junta três coisas da Narutopedia:

- **Kekkei genkai:** Sharingan, Mangekyō, Rinnegan, Byakugan, Mokuton, Hyōton, Yōton, Shikotsumyaku e outras.
- **Classificações:** Modo Sábio, Jinchūriki, Bijū, Ninja Médico, Invocação.
- **Técnicas marcantes:** Hiraishin e Oito Portões.

A coluna **Tipo de jutsu** lista quais dos três ramos o ninja domina: **Taijutsu**, **Ninjutsu** e **Genjutsu**. A Narutopedia não traz esse dado de forma estruturada, então ele é curado à mão em `JUTSU_TYPES` (`scripts/overrides.ts`), pelo que o personagem usa de forma marcante no mangá:

- **Taijutsu:** luta corpo a corpo ou com armas brancas é marcante (Punho Gentil, Oito Portões, espadachins).
- **Ninjutsu:** técnicas de chakra além do básico da Academia. Quem tem natureza de chakra, kekkei genkai de elemento, Modo Sábio, ninjutsu médico ou invocação sempre tem Ninjutsu. Exemplo: o Might Guy tem Taijutsu e Ninjutsu.
- **Genjutsu:** lança ilusões. Quem tem Sharingan sempre tem Genjutsu.
- **Nenhum:** civis, samurais e animais sem técnicas. Animais invocados lutam com o corpo e ficam só com Taijutsu, salvo os que usam técnicas nomeadas.

Ao rodar o importador, o relatório avisa se algum personagem contradiz essas regras.

## Busca

As sugestões mostram só quem tem o nome, ou um apelido, **começando** com o que foi digitado: "a" lista Akamaru, Asuma, Anko... O trecho digitado aparece em destaque. Apelidos como "Pain", "Tobi" ou "Primeiro Hokage" ficam em `ALIASES` (`scripts/overrides.ts`) e aparecem com o nome real ao lado.

## Visual

Direção de arte inspirada nos menus inclinados de Persona 3 Reload, com as cores do Naruto sobre um céu de anime.

- **Cores** (`src/index.css`): preto-tinta (`ink`), laranja (`orange`) e vermelho Uzumaki (`scarlet`), com o branco das caixas (`paper`) e o cinza-aço dos rótulos (`steel`). Os resultados usam verde (`hit`), amarelo (`near`) e azul-marinho (`miss`), sempre com um glifo (✓ ≈ ✕), então a cor nunca é a única pista.
- **Fonte:** Archivo, em itálico pesado e caixa alta nos títulos.
- **Formas:** faixas e botões inclinados, caixas brancas com pontos de halftone, borda laranja e sombra dura preta.
- **Topo:** a marca "Uzumadle" com o símbolo do clã Uzumaki (`SpiralMark`, que também é o favicon) e o chip preto com o dia e a data.
- **Menu:** Diário, Infinito e Como jogar numa faixa inclinada, à esquerda (`MenuBanner`).
- **Fundo (`Backdrop`):** `public/backdrop/4knaruto.jpg`, em tela cheia, com o Naruto de costas no canto direito.

## Estrutura

```
scripts/
  import-characters.ts  baixa e converte os personagens
  overrides.ts          correções manuais, apelidos e tipos de jutsu
src/
  types/       character.ts, game.ts
  data/        characters.generated.ts (gerado), characters.ts, arcs.ts (arcos e capítulos)
  utils/       gameLogic.ts (semente, sorteio, comparação), storage.ts, celebrate.ts
  hooks/       useDailyGame, useInfiniteGame, useGuesses
  components/  Navbar, Hero, MenuBanner, CharacterInput, GuessGrid, GuessRow, Legend,
               VictoryBanner, HowToPlay, Countdown, Avatar, Card, GenderIcon, NatureIcon,
               SpiralMark, Backdrop
```

## Fotos dos personagens

Cada personagem tem um rosto em `public/characters/<id>.webp` (160×160, cerca de 7 KB cada), ligado pelo campo `image`. Exemplo: `naruto-uzumaki` usa `characters/naruto-uzumaki.webp`.

- **Como são feitas:** o importador baixa a foto da AniList e corta um quadrado perto do topo do retrato, onde fica o rosto. O ponto do corte é `FACE_OFFSET` no script.
- **Se a foto não carregar:** o `Avatar` mostra as iniciais numa cor fixa.
- **Corrigir uma foto:** quando a AniList não mostra o rosto, aponte outra imagem em `IMAGE_OVERRIDES` (`scripts/overrides.ts`). O Obito, que na AniList só aparece de máscara, usa a foto da [Kitsu](https://kitsu.io).
- **Por que não a Narutopedia:** o servidor de imagens dela bloqueia downloads automáticos com o desafio anti-robô da Cloudflare.
- **Direitos:** as imagens pertencem aos donos de Naruto (Masashi Kishimoto/Shueisha/Studio Pierrot). Use num projeto pessoal ou de fã, sem fins comerciais.

## Base de personagens

`src/data/characters.generated.ts` é gerado pelo importador. Não edite esse arquivo à mão.

```bash
npm run import:characters                 # usa o cache em scripts/.cache
npm run import:characters -- --refresh    # baixa tudo de novo, fotos inclusive
npm run import:characters -- --limit 150  # mantém só os 150 mais populares
```

Precisa do Node 22.18 ou mais novo, que roda TypeScript direto. O `npm run build` checa os tipos do script e também da base gerada.

### Fontes

| Fonte | O que fornece |
| --- | --- |
| [Narutopedia](https://naruto.fandom.com) (CC BY-SA), lida pela [Dattebayo API](https://github.com/viniciusschuelter/dattebayo-api) | Sexo, afiliação, clã, naturezas, capítulo de estreia e atributos |
| Páginas de arco da Narutopedia | Capítulos de cada arco, em `src/data/arcs.ts` |
| [AniList](https://anilist.co) (GraphQL) | Favoritos de cada personagem, usados para filtrar e ordenar, e a foto do rosto |
| [Kitsu](https://kitsu.io) | Fotos avulsas em `IMAGE_OVERRIDES` e o pôster de Shippuden do fundo |

A licença da Narutopedia pede atribuição: o rodapé do jogo cita as fontes.

### Regras de conversão

- **Quem entra:** quem estreia no mangá até o capítulo 699 e aparece no elenco de Naruto ou Shippuden na AniList.
- **Lista e respostas:** a lista fica ordenada por popularidade, e só os 100 primeiros podem ser a resposta (`ANSWER_POOL` em `characters.ts`). Os outros servem como palpite.
- **O que se descarta:** dados marcados como "só no anime", nos filmes, nos jogos ou nos livros. A afiliação "Forças Aliadas Shinobi" também sai, porque vale para quase todo mundo.
- **Países e lugares:** só aparecem quando o personagem não tem vila nem organização. A exceção são os não humanos: o Gamabunta aparece como Monte Myōboku e Folha.
- **Atributos (antes "Habilidades"):**
  - Kekkei genkai viram o nome em japonês (Wood Release vira Mokuton). As variantes do Mangekyō (comum e Eterno) viram uma só.
  - O Tenseigan sai, porque só existe no filme The Last.
  - "Sensor" também sai: vale para 28 personagens e poluiria a coluna.
- **Era Boruto:** a Narutopedia descreve a franquia inteira. O que muda só na era Boruto é corrigido em `scripts/overrides.ts`. Exemplos: casamentos, mudanças de vila e o Mokuton da Moegi.
