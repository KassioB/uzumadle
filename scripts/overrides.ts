// Correções manuais aplicadas pelo importador por cima dos dados da Narutopedia.
// As chaves são os nomes exatamente como aparecem na Narutopedia.
import type { Character, JutsuType } from '../src/types/character.ts';

type Override = Partial<Omit<Character, 'id' | 'aliases' | 'image'>>;

export const OVERRIDES: Readonly<Record<string, Override>> = {
  // A Narutopedia marca "Vários" por causa das trocas de corpo.
  Orochimaru: { gender: 'Masculino' },
  // Sem sexo na Narutopedia; é tratado como "ele".
  Kurama: { gender: 'Masculino' },
  // Abre o Oitavo Portão contra os Sete Espadachins, mas a técnica não está na lista dele.
  'Might Duy': { abilities: ['Oito Portões'] },
  // Só aprende Mokuton na era Boruto.
  'Moegi Kazamatsuri': { abilities: [] },
  // A Narutopedia já mostra o clã do casamento (era Boruto) sem marcar isso.
  'Sakura Haruno': { clan: 'Nenhum' },
  Sai: { clan: 'Nenhum' },
  'Kurenai Yūhi': { clan: 'Nenhum' },
  // Casam e se mudam para Konoha só na era Boruto.
  Temari: { clan: 'Nenhum', affiliations: ['Areia'] },
  Karui: { clan: 'Nenhum', affiliations: ['Nuvem'] },
  // Na Narutopedia o clã se chama "Jūgo's Clan".
  Jūgo: { clan: 'Clã do Jūgo' },
  // A AniList e a Kitsu só têm foto do Pain: o nome deixa claro de quem é o rosto.
  Nagato: { name: 'Nagato (Pain)' },
  // Nomes em português.
  'A (Fourth Raikage)': { name: 'A (Quarto Raikage)' },
  'A (Third Raikage)': { name: 'A (Terceiro Raikage)' },
  'Sakon and Ukon': { name: 'Sakon e Ukon' },
};

/**
 * Quais dos três ramos de técnicas cada ninja domina, pelo id do personagem.
 * A Narutopedia não traz isso de forma estruturada, então a lista é curada à mão.
 * Vale o que o personagem usa de forma marcante no mangá, não tudo o que ele consegue fazer:
 * - Taijutsu: luta corpo a corpo ou com armas brancas é marcante (punhos, chutes, Punho Gentil,
 *   Oito Portões, espadachins).
 * - Ninjutsu: usa técnicas de chakra além do básico da Academia. Quem tem natureza de chakra,
 *   kekkei genkai de elemento, Modo Sábio, ninjutsu médico ou invocação sempre tem Ninjutsu.
 * - Genjutsu: lança ilusões. Quem tem Sharingan sempre tem Genjutsu.
 * - Animais invocados lutam com o corpo (Taijutsu), salvo os que usam técnicas nomeadas.
 * - Lista vazia: não usa técnicas ninja (civis, samurais, gatos ninja sem técnicas).
 * O importador avisa quando uma lista contradiz as naturezas ou as habilidades do personagem.
 */
export const JUTSU_TYPES: Readonly<Record<string, readonly JutsuType[]>> = {
  'itachi-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'kakashi-hatake': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan e Hell Viewing
  'naruto-uzumaki': ['Taijutsu', 'Ninjutsu'],
  'sasuke-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'shikamaru-nara': ['Ninjutsu'],
  gaara: ['Ninjutsu'],
  jiraiya: ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'minato-namikaze': ['Taijutsu', 'Ninjutsu'],
  'hinata-hyuga': ['Taijutsu', 'Ninjutsu'], // Punho Gentil e naturezas Fogo e Raio
  nagato: ['Ninjutsu'],
  'rock-lee': ['Taijutsu'],
  'madara-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'obito-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'sakura-haruno': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'might-guy': ['Taijutsu', 'Ninjutsu'], // naturezas Fogo e Raio
  'neji-hyuga': ['Taijutsu', 'Ninjutsu'], // Punho Gentil e naturezas Fogo, Terra e Água
  tsunade: ['Taijutsu', 'Ninjutsu'],
  orochimaru: ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'zabuza-momochi': ['Taijutsu', 'Ninjutsu'],
  temari: ['Ninjutsu'],
  deidara: ['Ninjutsu'],
  sasori: ['Ninjutsu'],
  kurama: ['Ninjutsu'],
  konan: ['Ninjutsu'],
  'kushina-uzumaki': ['Ninjutsu'],
  sai: ['Taijutsu', 'Ninjutsu'], // luta corpo a corpo, além da tinta
  'hashirama-senju': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // luta corpo a corpo com o Madara e usa o Bringer-of-Darkness
  'ino-yamanaka': ['Ninjutsu'],
  haku: ['Ninjutsu'],
  'shisui-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'tobirama-senju': ['Taijutsu', 'Ninjutsu'],
  tenten: ['Taijutsu', 'Ninjutsu'],
  'kiba-inuzuka': ['Taijutsu', 'Ninjutsu'],
  'killer-b': ['Taijutsu', 'Ninjutsu'],
  akamaru: ['Taijutsu'],
  'iruka-umino': ['Taijutsu', 'Ninjutsu'],
  hidan: ['Taijutsu', 'Ninjutsu'],
  kimimaro: ['Taijutsu', 'Ninjutsu'],
  'kisame-hoshigaki': ['Taijutsu', 'Ninjutsu'],
  yamato: ['Ninjutsu'],
  'asuma-sarutobi': ['Taijutsu', 'Ninjutsu'],
  'anko-mitarashi': ['Taijutsu', 'Ninjutsu'],
  'kabuto-yakushi': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'genma-shiranui': ['Taijutsu', 'Ninjutsu'],
  'shino-aburame': ['Ninjutsu'],
  'konohamaru-sarutobi': ['Taijutsu', 'Ninjutsu'],
  'suigetsu-hozuki': ['Taijutsu', 'Ninjutsu'],
  'hanabi-hyuga': ['Taijutsu'],
  'kurenai-yuhi': ['Ninjutsu', 'Genjutsu'],
  'hiruzen-sarutobi': ['Taijutsu', 'Ninjutsu'],
  'choji-akimichi': ['Taijutsu', 'Ninjutsu'],
  'rin-nohara': ['Ninjutsu'],
  'mei-terumi': ['Ninjutsu'],
  kankuro: ['Ninjutsu'],
  gamabunta: ['Taijutsu', 'Ninjutsu'],
  kakuzu: ['Taijutsu', 'Ninjutsu'],
  pakkun: ['Taijutsu'],
  gamakichi: ['Taijutsu', 'Ninjutsu'], // Modo Sábio e natureza Água
  yahiko: ['Ninjutsu'],
  shizune: ['Ninjutsu'],
  karin: ['Ninjutsu'],
  utakata: ['Ninjutsu'],
  'shikaku-nara': ['Ninjutsu'],
  'kaguya-otsutsuki': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  tayuya: ['Ninjutsu', 'Genjutsu'],
  darui: ['Ninjutsu'],
  samui: ['Ninjutsu'],
  gamatatsu: ['Taijutsu'],
  'hayate-gekko': ['Taijutsu'],
  omoi: ['Taijutsu', 'Ninjutsu'],
  'indra-otsutsuki': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  kurotsuchi: ['Ninjutsu'],
  'mikoto-uchiha': ['Ninjutsu'],
  chiyo: ['Ninjutsu'],
  'a-fourth-raikage': ['Taijutsu', 'Ninjutsu'],
  'kotetsu-hagane': ['Taijutsu', 'Genjutsu'], // Demonic Illusion: False Surroundings
  'hagoromo-otsutsuki': ['Taijutsu', 'Ninjutsu'],
  'yugao-uzuki': ['Taijutsu', 'Ninjutsu'],
  jugo: ['Taijutsu', 'Ninjutsu'],
  onoki: ['Ninjutsu'],
  karui: ['Taijutsu', 'Ninjutsu'],
  'sakumo-hatake': ['Taijutsu', 'Ninjutsu'],
  'izumo-kamizuki': ['Taijutsu', 'Ninjutsu'], // natureza Água
  'yagura-karatachi': ['Ninjutsu'],
  ebisu: ['Ninjutsu'],
  'danzo-shimura': ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  fukasaku: ['Taijutsu', 'Ninjutsu', 'Genjutsu'],
  'might-duy': ['Taijutsu'],
  chojuro: ['Taijutsu', 'Ninjutsu'], // espadachim
  mabui: ['Ninjutsu'],
  'yugito-nii': ['Ninjutsu'],
  guruko: ['Taijutsu'], // ninken: luta com o corpo
  pakura: ['Ninjutsu'],
  'ibiki-morino': ['Taijutsu', 'Ninjutsu'],
  'shibi-aburame': ['Ninjutsu'],
  'moegi-kazamatsuri': ['Ninjutsu'],
  'tsume-inuzuka': ['Taijutsu', 'Ninjutsu'],
  'hamura-otsutsuki': ['Ninjutsu'],
  matsuri: ['Ninjutsu'],
  fu: ['Ninjutsu'],
  kuromaru: ['Taijutsu'],
  'gengetsu-hozuki': ['Ninjutsu'],
  'fugaku-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan
  'asura-otsutsuki': ['Taijutsu', 'Ninjutsu'],
  'inoichi-yamanaka': ['Ninjutsu'],
  'mito-uzumaki': ['Ninjutsu'],
  'hana-inuzuka': ['Taijutsu', 'Ninjutsu'],
  'dan-kato': ['Ninjutsu'],
  hanzo: ['Taijutsu', 'Ninjutsu'],
  'hiashi-hyuga': ['Taijutsu'],
  manda: ['Taijutsu'], // invocação que luta com o corpo
  'choza-akimichi': ['Taijutsu', 'Ninjutsu'],
  'hizashi-hyuga': ['Taijutsu'],
  inari: [],
  gamaken: ['Taijutsu', 'Ninjutsu'],
  'sakon-and-ukon': ['Taijutsu', 'Ninjutsu'],
  tazuna: [],
  shima: ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Frog Kata e o canto ilusório dos sapos
  mifune: [], // samurai
  mu: ['Ninjutsu'],
  'izuna-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan
  'aoba-yamashiro': ['Ninjutsu'],
  'a-third-raikage': ['Taijutsu', 'Ninjutsu'],
  'torune-aburame': ['Ninjutsu'],
  'dosu-kinuta': ['Ninjutsu'],
  tamaki: [], // civil, lojista
  ao: ['Ninjutsu'],
  c: ['Ninjutsu'],
  kidomaru: ['Ninjutsu'],
  'kin-tsuchi': ['Ninjutsu', 'Genjutsu'],
  yashamaru: ['Ninjutsu'],
  'ameyuri-ringo': ['Taijutsu', 'Ninjutsu'], // espadachim
  rasa: ['Ninjutsu'],
  bisuke: ['Taijutsu'],
  'raido-namiashi': ['Taijutsu', 'Ninjutsu'],
  gamahiro: ['Taijutsu', 'Ninjutsu'],
  hina: [], // gato ninja sem técnicas conhecidas
  'kagami-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan
  aoda: ['Taijutsu'],
  denka: [], // gato ninja sem técnicas conhecidas
  han: ['Taijutsu', 'Ninjutsu'],
  akatsuchi: ['Taijutsu', 'Ninjutsu'],
  ginkaku: ['Ninjutsu'],
  shiho: ['Ninjutsu'],
  'kushimaru-kuriarare': ['Taijutsu'],
  baki: ['Ninjutsu'],
  kaiza: [],
  maki: ['Ninjutsu'],
  jirobo: ['Taijutsu', 'Ninjutsu'],
  'zaku-abumi': ['Ninjutsu'],
  kinkaku: ['Ninjutsu'],
  roshi: ['Ninjutsu'],
  shin: ['Ninjutsu'],
  karura: ['Ninjutsu'],
  nawaki: ['Ninjutsu'],
  'ashina-uzumaki': ['Ninjutsu'],
  'nono-yakushi': ['Ninjutsu'],
  genzo: [],
  tsunami: [],
  okisuke: [],
  'yoshino-nara': ['Ninjutsu'],
  gerotora: ['Taijutsu'], // sapo invocado: luta com o corpo
  kosuke: [], // sapo mensageiro
  sari: ['Ninjutsu'],
  'fu-yamanaka': ['Ninjutsu'],
  'homura-mitokado': ['Ninjutsu'],
  ami: ['Ninjutsu'],
  nekobaa: [], // civil, lojista
  'biwako-sarutobi': ['Ninjutsu'],
  'teyaki-uchiha': [], // civil, dono de loja
  'raiga-kurosuki': ['Taijutsu', 'Ninjutsu'],
  chiriku: ['Ninjutsu'],
  'koharu-utatane': ['Ninjutsu'],
  motoi: ['Ninjutsu'],
  'tonbo-tobitake': ['Ninjutsu'],
  ebizo: ['Ninjutsu'],
  gato: [],
  suzume: ['Ninjutsu'], // chūnin e professora da Academia
  'uruchi-uchiha': [], // civil, dona de padaria
  yakku: ['Ninjutsu'],
  yura: ['Ninjutsu'],
  gozu: ['Taijutsu', 'Ninjutsu'],
  hyo: ['Ninjutsu'],
  shigure: ['Ninjutsu'],
  zori: [], // samurai mercenário
  bansai: ['Ninjutsu'],
  midare: ['Ninjutsu'],
  shibire: ['Ninjutsu'],
  tobio: ['Ninjutsu'],
  mubi: ['Ninjutsu'],
  'tekka-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan
  'yoroi-akado': ['Taijutsu', 'Ninjutsu'],
  'shimon-hijiri': ['Ninjutsu'],
  kagari: ['Ninjutsu'],
  meizu: ['Taijutsu', 'Ninjutsu'],
  oboro: ['Ninjutsu'],
  'iwashi-tatami': ['Taijutsu', 'Ninjutsu'],
  'misumi-tsurugi': ['Taijutsu', 'Ninjutsu'],
  waraji: [], // samurai mercenário
  akane: [], // civil, carpinteira
  'iwana-akame': ['Ninjutsu'],
  baiu: ['Ninjutsu'],
  giichi: [], // civil, operário da ponte
  shiore: ['Ninjutsu'],
  tanzo: ['Ninjutsu'],
  'inabi-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan
  'yashiro-uchiha': ['Taijutsu', 'Ninjutsu', 'Genjutsu'], // Sharingan
  yajirobee: ['Taijutsu'],
};

/** Outros nomes aceitos na busca. */
export const ALIASES: Readonly<Record<string, readonly string[]>> = {
  Nagato: ['Pain'],
  'Obito Uchiha': ['Tobi'],
  'Killer B': ['Killer Bee'],
  'Might Guy': ['Maito Gai', 'Gai Sensei'],
  'A (Fourth Raikage)': ['Raikage', 'Ay'],
  Kurama: ['Kyuubi', 'Nove Caudas'],
  'Hashirama Senju': ['Primeiro Hokage'],
  'Tobirama Senju': ['Segundo Hokage'],
  'Hiruzen Sarutobi': ['Terceiro Hokage'],
  'Minato Namikaze': ['Quarto Hokage'],
  Tsunade: ['Quinta Hokage'],
};

/**
 * Nomes da AniList que não batem com a Narutopedia, mesmo sem acento
 * e sem vogal dupla (AniList → Narutopedia).
 */
export const ANILIST_NAME_FIXES: Readonly<Record<string, string>> = {
  // A AniList separa a persona do personagem; aqui vale o maior número de favoritos.
  Pain: 'Nagato',
  Tobi: 'Obito Uchiha',
  'Guy Might': 'Might Guy',
  'Duy Might': 'Might Duy',
  'Tsunade Senju': 'Tsunade',
  'Killer Bee': 'Killer B',
  'Kimimaro Kaguya': 'Kimimaro',
  A: 'A (Fourth Raikage)',
  'Third Raikage': 'A (Third Raikage)',
  Yagura: 'Yagura Karatachi',
  'Ashura Ootsutsuki': 'Asura Ōtsutsuki',
  Sakon: 'Sakon and Ukon',
  Ukon: 'Sakon and Ukon',
};

/**
 * Fotos que substituem a da AniList, quando ela não mostra o rosto do personagem.
 * Kitsu: https://kitsu.io/api/edge/characters?filter[name]=<nome>
 */
export const IMAGE_OVERRIDES: Readonly<Record<string, string>> = {
  // Na AniList o Obito só aparece como "Tobi", de máscara.
  'Obito Uchiha': 'https://media.kitsu.app/characters/images/17953/original.jpg',
};

/** Entradas da Narutopedia que não fazem sentido como resposta. */
export const EXCLUDED: ReadonlySet<string> = new Set([]);
