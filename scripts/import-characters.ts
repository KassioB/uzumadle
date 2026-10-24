/**
 * Importa personagens para src/data/characters.generated.ts.
 *
 * Fontes:
 * - Dattebayo API (https://dattebayo-api.onrender.com), que reúne os dados da Narutopedia
 *   (https://naruto.fandom.com, licença CC BY-SA): sexo, afiliação, clã, naturezas,
 *   capítulo de estreia no mangá e habilidades (kekkei genkai, classificações e técnicas).
 * - AniList (https://anilist.co): favoritos de cada personagem, usados para ficar só com os
 *   mais conhecidos e para ordenar a lista por popularidade, e a foto de cada um, recortada
 *   no rosto e salva em public/characters/<id>.webp.
 *
 * Uso:
 *   npm run import:characters                  usa o cache em scripts/.cache
 *   npm run import:characters -- --refresh     baixa tudo de novo
 *   npm run import:characters -- --limit 150   quantos personagens manter (padrão: 300)
 */
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import sharp from 'sharp';
import { findArcByChapter } from '../src/data/arcs.ts';
import type {
  Ability,
  Affiliation,
  ChakraNature,
  Character,
  Gender,
  MainAffiliation,
  PlaceAffiliation,
} from '../src/types/character.ts';
import {
  ALIASES,
  ANILIST_NAME_FIXES,
  EXCLUDED,
  IMAGE_OVERRIDES,
  JUTSU_TYPES,
  OVERRIDES,
} from './overrides.ts';

const DATTEBAYO_URL = 'https://dattebayo-api.onrender.com/characters?page=1&limit=2000';
const ANILIST_URL = 'https://graphql.anilist.co';
/** Naruto (20) e Naruto Shippuden (1735) na AniList. */
const ANILIST_MEDIA = [20, 1735];
/** 50 personagens por página, do mais para o menos favoritado. */
const ANILIST_PAGES = 10;
/** O capítulo 700 é o epílogo, já na era Boruto. */
const LAST_CHAPTER = 699;

const CACHE_DIR = new URL('./.cache/', import.meta.url);
/** v2: o cache passou a guardar a foto de cada personagem. */
const ANILIST_CACHE = 'anilist-v2.json';
const OUTPUT = new URL('../src/data/characters.generated.ts', import.meta.url);

const FACES_DIR = new URL('../public/characters/', import.meta.url);
const FACE_SIZE = 160;
/**
 * Onde cortar o quadrado num retrato em pé: 0 = colado no topo, 0.5 = no meio.
 * Nos retratos da AniList o rosto fica no terço de cima.
 */
const FACE_OFFSET = 0.15;

const { values: args } = parseArgs({
  options: {
    refresh: { type: 'boolean', default: false },
    limit: { type: 'string', default: '300' },
  },
});
const limit = Number(args.limit);

// ---------- Formatos das APIs ----------

type OneOrMany = string | string[];

interface ApiCharacter {
  id: number;
  name: string;
  debut?: { manga?: string };
  natureType?: string[];
  jutsu?: string[];
  personal?: {
    sex?: string;
    clan?: OneOrMany;
    affiliation?: OneOrMany;
    /** Só aparece em quem não é humano (sapos, cobras, cães ninja...). */
    species?: OneOrMany;
    kekkeiGenkai?: OneOrMany;
    kekkeiTōta?: OneOrMany;
    kekkeiMōra?: OneOrMany;
    classification?: OneOrMany;
  };
}

interface AniListCharacter {
  name: { full: string | null; alternative: (string | null)[] | null };
  image: { large: string | null } | null;
  favourites: number | null;
}

interface AniListPage {
  data: {
    Media: {
      characters: { pageInfo: { hasNextPage: boolean }; nodes: AniListCharacter[] };
    };
  };
}

// ---------- Download com cache ----------

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function cached<T>(file: string, load: () => Promise<T>): Promise<T> {
  const url = new URL(file, CACHE_DIR);
  if (!args.refresh) {
    try {
      return JSON.parse(await readFile(url, 'utf8')) as T;
    } catch {
      // Ainda não tem cache: baixa.
    }
  }
  const data = await load();
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(url, JSON.stringify(data));
  return data;
}

async function fetchDattebayo(): Promise<ApiCharacter[]> {
  // O servidor gratuito dorme quando ninguém usa: o primeiro pedido pode levar ~1 min.
  console.log('Baixando personagens da Dattebayo API...');
  const res = await fetch(DATTEBAYO_URL);
  if (!res.ok) throw new Error(`Dattebayo API respondeu ${res.status}`);
  const body = (await res.json()) as { characters: ApiCharacter[] };
  return body.characters;
}

const ANILIST_QUERY = `
  query ($id: Int, $page: Int) {
    Media(id: $id, type: ANIME) {
      characters(page: $page, perPage: 50, sort: FAVOURITES_DESC) {
        pageInfo { hasNextPage }
        nodes { name { full alternative } image { large } favourites }
      }
    }
  }`;

async function fetchAniList(): Promise<AniListCharacter[]> {
  const all: AniListCharacter[] = [];
  for (const id of ANILIST_MEDIA) {
    for (let page = 1; page <= ANILIST_PAGES; page++) {
      console.log(`AniList: anime ${id}, página ${page}...`);
      const res = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ query: ANILIST_QUERY, variables: { id, page } }),
      });
      if (res.status === 429) {
        const wait = Number(res.headers.get('retry-after') ?? 60);
        console.log(`AniList pediu uma pausa de ${wait}s.`);
        await sleep(wait * 1000);
        page--;
        continue;
      }
      if (!res.ok) throw new Error(`AniList respondeu ${res.status}`);
      const { nodes, pageInfo } = ((await res.json()) as AniListPage).data.Media.characters;
      all.push(...nodes);
      if (!pageInfo.hasNextPage) break;
      // A AniList aceita uns 30 pedidos por minuto.
      await sleep(2500);
    }
  }
  return all;
}

// ---------- Normalização ----------

/** Chave para cruzar nomes das duas fontes: sem acento e sem vogal dupla ("Hyuuga" = "Hyūga"). */
function nameKey(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ou/g, 'o')
    .replace(/uu/g, 'u')
    .replace(/oo/g, 'o')
    .replace(/ii/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const toArray = (value: OneOrMany | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

const unique = <T>(items: T[]): T[] => [...new Set(items)];

/** Separa "Lightning Release  (Affinity; Anime only)" em valor e notas. */
function parseEntry(raw: string): { value: string; notes: string[] } {
  // Às vezes a API cola junto uma mensagem de erro da wiki, que começa com aspas.
  const clean = raw.split('"')[0] ?? raw;
  const notes = [...clean.matchAll(/\(([^)]*)\)/g)].flatMap((m) =>
    (m[1] ?? '').split(';').map((note) => note.trim()),
  );
  const value = clean.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  return { value, notes };
}

/** Descarta o que só existe no anime, nos filmes, nos jogos ou nos livros. */
function isCanon(notes: string[]): boolean {
  // "Affinity; Anime only": só a afinidade é do anime, a natureza em si é canônica.
  if (notes.some((note) => /^affinity$/i.test(note))) return true;
  return !notes.some((note) => /^(anime|novel|movie|game) only$/i.test(note));
}

// ---------- Mapeamento para o formato do jogo ----------

const NATURES: Readonly<Record<string, ChakraNature>> = {
  'Fire Release': 'Fogo',
  'Wind Release': 'Vento',
  'Lightning Release': 'Raio',
  'Earth Release': 'Terra',
  'Water Release': 'Água',
};
const NATURE_ORDER: readonly ChakraNature[] = ['Fogo', 'Vento', 'Raio', 'Terra', 'Água'];

const MAIN_AFFILIATIONS: Readonly<Record<string, MainAffiliation>> = {
  Konohagakure: 'Folha',
  Sunagakure: 'Areia',
  Kirigakure: 'Névoa',
  Iwagakure: 'Pedra',
  Kumogakure: 'Nuvem',
  Amegakure: 'Chuva',
  Takigakure: 'Cachoeira',
  Kusagakure: 'Grama',
  Otogakure: 'Som',
  Uzushiogakure: 'Redemoinho',
  Yugakure: 'Fontes Termais',
  Akatsuki: 'Akatsuki',
  Root: 'Raiz',
};

const PLACE_AFFILIATIONS: Readonly<Record<string, PlaceAffiliation>> = {
  'Land of Waves': 'País das Ondas',
  'Land of Iron': 'País do Ferro',
  'Land of Fire': 'País do Fogo',
  'Land of Wind': 'País do Vento',
  'Land of Earth': 'País da Terra',
  'Land of Water': 'País da Água',
  'Land of Lightning': 'País do Raio',
  'Land of Hot Water': 'País das Fontes Termais',
  'Mount Myōboku': 'Monte Myōboku',
  'Ryūchi Cave': 'Caverna Ryūchi',
  'Shikkotsu Forest': 'Floresta Shikkotsu',
  'Fire Temple': 'Templo do Fogo',
  Moon: 'Lua',
};

/** Genéricas demais para servir de pista (quase todo mundo luta na guerra) ou da era Boruto. */
const IGNORED_AFFILIATIONS = new Set(['Allied Shinobi Forces', 'Kara', 'Konoha Orphanage']);

const unknownAffiliations = new Map<string, number>();

/**
 * País e lugar só entram quando não há vila nem organização, exceto para quem não é
 * humano: o Gamabunta é do Monte Myōboku antes de ser da Folha.
 */
function mapAffiliations(raw: OneOrMany | undefined, isHuman: boolean): Affiliation[] {
  const main: MainAffiliation[] = [];
  const places: PlaceAffiliation[] = [];
  for (const { value, notes } of toArray(raw).map(parseEntry)) {
    if (!isCanon(notes) || IGNORED_AFFILIATIONS.has(value)) continue;
    const mainValue = MAIN_AFFILIATIONS[value];
    const placeValue = PLACE_AFFILIATIONS[value];
    if (mainValue) main.push(mainValue);
    else if (placeValue) places.push(placeValue);
    else unknownAffiliations.set(value, (unknownAffiliations.get(value) ?? 0) + 1);
  }
  if (!isHuman) return unique([...places, ...main]);
  return unique(main.length > 0 ? main : places);
}

const multipleClans: string[] = [];

function mapClan(name: string, raw: OneOrMany | undefined): string {
  const clans = toArray(raw)
    .map(parseEntry)
    .filter(({ notes }) => isCanon(notes))
    .map(({ value }) => value.replace(/\s+(Clan|Family)$/i, ''))
    .filter(Boolean);
  if (clans.length > 1) multipleClans.push(`${name}: ${clans.join(', ')}`);
  return clans[0] ?? 'Nenhum';
}

function mapNatures(raw: string[] | undefined): ChakraNature[] {
  const found = new Set<ChakraNature>();
  for (const { value, notes } of (raw ?? []).map(parseEntry)) {
    const nature = NATURES[value];
    if (nature && isCanon(notes)) found.add(nature);
  }
  return NATURE_ORDER.filter((nature) => found.has(nature));
}

function mapGender(raw: string | undefined): Gender | undefined {
  if (raw === 'Male') return 'Masculino';
  if (raw === 'Female') return 'Feminino';
  return undefined;
}

/** Kekkei genkai, kekkei tōta e kekkei mōra. Nomes em japonês, como os fãs usam. */
const KEKKEI_GENKAI: Readonly<Record<string, Ability>> = {
  Sharingan: 'Sharingan',
  'Mangekyō Sharingan': 'Mangekyō',
  'Eternal Mangekyō Sharingan': 'Mangekyō',
  Rinnegan: 'Rinnegan',
  'Rinne Sharingan': 'Rinne Sharingan',
  Byakugan: 'Byakugan',
  'Wood Release': 'Mokuton',
  'Ice Release': 'Hyōton',
  'Lava Release': 'Yōton',
  'Boil Release': 'Futton',
  'Storm Release': 'Ranton',
  'Explosion Release': 'Bakuton',
  'Magnet Release': 'Jiton',
  'Scorch Release': 'Shakuton',
  'Dust Release': 'Jinton',
  Shikotsumyaku: 'Shikotsumyaku',
  "Jūgo's Clan's Kekkei Genkai": 'Senninka',
  "Sakon and Ukon's Kekkei Genkai": 'Fusão Corporal',
};
/** O Tenseigan só aparece no filme The Last. */
const IGNORED_KEKKEI_GENKAI = new Set(['Tenseigan']);

/** Classificações da Narutopedia que contam como habilidade (Sensor ficou de fora: é comum demais). */
const CLASSIFICATIONS: Readonly<Record<string, Ability>> = {
  Sage: 'Modo Sábio',
  Jinchūriki: 'Jinchūriki',
  'Pseudo-Jinchūriki': 'Jinchūriki',
  'Tailed Beast': 'Bijū',
  'Medical-nin': 'Ninja Médico',
  Summon: 'Invocação',
};

/** Técnicas que viram habilidade, pelo nome exato na Narutopedia. */
const JUTSU_ABILITIES: Readonly<Record<string, Ability>> = {
  'Sage Mode': 'Modo Sábio',
  'Flying Thunder God Technique': 'Hiraishin',
  'Eight Gates': 'Oito Portões',
};

const ABILITY_ORDER: readonly Ability[] = [
  'Sharingan',
  'Mangekyō',
  'Rinnegan',
  'Rinne Sharingan',
  'Byakugan',
  'Mokuton',
  'Hyōton',
  'Yōton',
  'Futton',
  'Ranton',
  'Bakuton',
  'Jiton',
  'Shakuton',
  'Jinton',
  'Shikotsumyaku',
  'Senninka',
  'Fusão Corporal',
  'Modo Sábio',
  'Jinchūriki',
  'Bijū',
  'Hiraishin',
  'Oito Portões',
  'Ninja Médico',
  'Invocação',
];

const unknownKekkeiGenkai = new Map<string, number>();

function mapAbilities(api: ApiCharacter): Ability[] {
  const found = new Set<Ability>();
  const personal = api.personal ?? {};
  const kekkei = [
    ...toArray(personal.kekkeiGenkai),
    ...toArray(personal.kekkeiTōta),
    ...toArray(personal.kekkeiMōra),
  ];
  for (const { value, notes } of kekkei.map(parseEntry)) {
    if (!isCanon(notes) || IGNORED_KEKKEI_GENKAI.has(value)) continue;
    const ability = KEKKEI_GENKAI[value];
    if (ability) found.add(ability);
    else unknownKekkeiGenkai.set(value, (unknownKekkeiGenkai.get(value) ?? 0) + 1);
  }
  for (const { value, notes } of toArray(personal.classification).map(parseEntry)) {
    const ability = CLASSIFICATIONS[value];
    if (ability && isCanon(notes)) found.add(ability);
  }
  for (const { value, notes } of (api.jutsu ?? []).map(parseEntry)) {
    const ability = JUTSU_ABILITIES[value];
    if (ability && isCanon(notes)) found.add(ability);
  }
  return ABILITY_ORDER.filter((ability) => found.has(ability));
}

function debutChapter(character: ApiCharacter): number | undefined {
  const match = character.debut?.manga?.match(/^Naruto Chapter #(\d+)/);
  return match ? Number(match[1]) : undefined;
}

// ---------- Conferência dos tipos de jutsu ----------

/** Habilidades que só existem para quem usa ninjutsu (Sharingan, Byakugan e Invocação ficam de fora). */
const NINJUTSU_ABILITIES: ReadonlySet<Ability> = new Set<Ability>([
  'Mokuton',
  'Hyōton',
  'Yōton',
  'Futton',
  'Ranton',
  'Bakuton',
  'Jiton',
  'Shakuton',
  'Jinton',
  'Shikotsumyaku',
  'Senninka',
  'Fusão Corporal',
  'Modo Sábio',
  'Jinchūriki',
  'Bijū',
  'Hiraishin',
  'Ninja Médico',
]);

/** Contradições entre os tipos de jutsu e o que o personagem já tem de naturezas e habilidades. */
function jutsuTypeProblems({ name, natures, abilities, jutsuTypes }: Character): string[] {
  const problems: string[] = [];
  if (!jutsuTypes.includes('Ninjutsu')) {
    if (natures.length > 0) problems.push(`${name} (natureza de chakra sem Ninjutsu)`);
    else if (abilities.some((ability) => NINJUTSU_ABILITIES.has(ability))) {
      problems.push(`${name} (habilidade de ninjutsu sem Ninjutsu)`);
    }
  }
  if (!jutsuTypes.includes('Genjutsu') && abilities.includes('Sharingan')) {
    problems.push(`${name} (Sharingan sem Genjutsu)`);
  }
  if (!jutsuTypes.includes('Taijutsu') && abilities.includes('Oito Portões')) {
    problems.push(`${name} (Oito Portões sem Taijutsu)`);
  }
  return problems;
}

// ---------- Popularidade e fotos ----------

interface AniListMatch {
  favourites: number;
  /** URL da foto na AniList, ou null quando ela só tem a imagem padrão. */
  image: string | null;
  /** O nome bateu sem passar por ANILIST_NAME_FIXES. */
  exact: boolean;
}

function usableImage(entry: AniListCharacter): string | null {
  const url = entry.image?.large;
  return url && !url.includes('/default.') ? url : null;
}

function buildAniListIndex(entries: AniListCharacter[]) {
  const byName = new Map<string, AniListMatch>();
  const byAlternative = new Map<string, AniListMatch>();

  const keep = (map: Map<string, AniListMatch>, name: string, entry: AniListCharacter) => {
    const fixed = ANILIST_NAME_FIXES[name];
    const key = nameKey(fixed ?? name);
    const exact = fixed === undefined;
    const previous = map.get(key);
    // Vale o maior número de favoritos, mas a foto vem do nome exato: "Nagato", não "Pain".
    const keepPreviousImage = previous !== undefined && (previous.exact || !exact);
    map.set(key, {
      favourites: Math.max(previous?.favourites ?? 0, entry.favourites ?? 0),
      image: keepPreviousImage
        ? (previous.image ?? usableImage(entry))
        : (usableImage(entry) ?? previous?.image ?? null),
      exact: (previous?.exact ?? false) || exact,
    });
  };

  for (const entry of entries) {
    if (!entry.name.full) continue;
    keep(byName, entry.name.full, entry);
    for (const alternative of entry.name.alternative ?? []) {
      if (alternative) keep(byAlternative, alternative, entry);
    }
  }
  return {
    /** O nome principal tem prioridade; o alternativo só entra se o principal não bater. */
    lookup(name: string): (AniListMatch & { viaAlternative: boolean }) | undefined {
      const key = nameKey(name);
      const direct = byName.get(key);
      if (direct) return { ...direct, viaAlternative: false };
      const alternative = byAlternative.get(key);
      return alternative && { ...alternative, viaAlternative: true };
    },
  };
}

async function downloadCached(file: string, url: string): Promise<Buffer> {
  const path = new URL(file, CACHE_DIR);
  if (!args.refresh) {
    try {
      return await readFile(path);
    } catch {
      // Ainda não tem cache: baixa.
    }
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`respondeu ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  await mkdir(new URL('.', path), { recursive: true });
  await writeFile(path, data);
  return data;
}

const failedFaces: string[] = [];

/** Baixa a foto, corta um quadrado em volta do rosto e salva em WebP. */
async function saveFace(id: string, url: string): Promise<string | undefined> {
  try {
    const source = await downloadCached(`images/${id}${extname(new URL(url).pathname)}`, url);
    const { width, height } = await sharp(source).metadata();
    if (!width || !height) throw new Error('imagem sem tamanho');
    const side = Math.min(width, height);
    await sharp(source)
      .extract({
        left: Math.round((width - side) / 2),
        top: Math.round((height - side) * FACE_OFFSET),
        width: side,
        height: side,
      })
      .resize(FACE_SIZE, FACE_SIZE)
      .webp({ quality: 80 })
      .toFile(fileURLToPath(new URL(`${id}.webp`, FACES_DIR)));
    return `characters/${id}.webp`;
  } catch (error) {
    failedFaces.push(`${id} (${error instanceof Error ? error.message : String(error)})`);
    return undefined;
  }
}

/** Roda `task` em todos os itens com no máximo `size` downloads ao mesmo tempo. */
async function inPool<T>(items: readonly T[], size: number, task: (item: T) => Promise<void>) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await task(items[next++] as T);
  };
  await Promise.all(Array.from({ length: size }, worker));
}

// ---------- Geração ----------

function render(characters: readonly Character[]): string {
  const today = new Date().toISOString().slice(0, 10);
  return `// Gerado por scripts/import-characters.ts em ${today}. Não edite à mão: as correções
// ficam em scripts/overrides.ts; depois rode \`npm run import:characters\`.
//
// Fontes: Narutopedia (https://naruto.fandom.com, CC BY-SA), lida pela Dattebayo API,
// e favoritos da AniList (https://anilist.co). Ordem: do mais popular para o menos.
import type { Character } from '../types/character';

export const GENERATED_CHARACTERS: readonly Character[] = [
${characters.map((character) => `  ${JSON.stringify(character)},`).join('\n')}
];
`;
}

const apiCharacters = await cached('dattebayo.json', fetchDattebayo);
const aniList = await cached(ANILIST_CACHE, fetchAniList);
const popularity = buildAniListIndex(aniList);

const skipped = { outsideManga: 0, unpopular: 0, excluded: 0 };
const missingGender: string[] = [];
const noAffiliation: string[] = [];
const viaAlternative: string[] = [];
const candidates: { character: Character; favourites: number; imageUrl: string | null }[] = [];
const seenIds = new Set<string>();

for (const api of apiCharacters) {
  if (EXCLUDED.has(api.name)) {
    skipped.excluded++;
    continue;
  }
  const chapter = debutChapter(api);
  const arc = chapter !== undefined && chapter <= LAST_CHAPTER ? findArcByChapter(chapter) : undefined;
  if (!arc) {
    skipped.outsideManga++;
    continue;
  }
  const popular = popularity.lookup(api.name);
  if (!popular) {
    skipped.unpopular++;
    continue;
  }

  const override = OVERRIDES[api.name] ?? {};
  const gender = override.gender ?? mapGender(api.personal?.sex);
  if (!gender) {
    missingGender.push(`${api.name} (${popular.favourites})`);
    continue;
  }
  // Sem afiliação é válido: os Ōtsutsuki e os Uchiha antigos vêm de antes das vilas.
  const isHuman = api.personal?.species === undefined;
  const affiliations =
    override.affiliations ?? mapAffiliations(api.personal?.affiliation, isHuman);
  if (affiliations.length === 0) noAffiliation.push(api.name);

  // A API tem alguns nomes repetidos.
  const id = slug(api.name);
  if (seenIds.has(id)) continue;
  seenIds.add(id);

  if (popular.viaAlternative) viaAlternative.push(`${api.name} (${popular.favourites})`);
  const aliases = ALIASES[api.name];
  candidates.push({
    favourites: popular.favourites,
    imageUrl: IMAGE_OVERRIDES[api.name] ?? popular.image,
    character: {
      id,
      name: override.name ?? api.name,
      ...(aliases && { aliases }),
      gender,
      affiliations,
      clan: override.clan ?? mapClan(api.name, api.personal?.clan),
      natures: override.natures ?? mapNatures(api.natureType),
      debutArcId: override.debutArcId ?? arc.id,
      abilities: override.abilities ?? mapAbilities(api),
      jutsuTypes: override.jutsuTypes ?? JUTSU_TYPES[id] ?? [],
    },
  });
}

candidates.sort((a, b) => b.favourites - a.favourites);
const selected = candidates.slice(0, limit);

console.log(`Preparando ${selected.length} fotos...`);
await mkdir(FACES_DIR, { recursive: true });
const faces = new Map<string, string>();
await inPool(selected, 6, async ({ character, imageUrl }) => {
  if (!imageUrl) {
    failedFaces.push(`${character.id} (sem foto na AniList)`);
    return;
  }
  const image = await saveFace(character.id, imageUrl);
  if (image) faces.set(character.id, image);
});

// Apaga fotos de quem saiu da lista.
for (const file of await readdir(FACES_DIR)) {
  if (!faces.has(file.replace(/\.webp$/, ''))) await unlink(new URL(file, FACES_DIR));
}

const withFaces: Character[] = selected.map(({ character: { id, name, ...rest } }) => {
  const image = faces.get(id);
  return { id, name, ...(image && { image }), ...rest };
});
await writeFile(OUTPUT, render(withFaces));

// ---------- Relatório ----------

const matchedKeys = new Set(apiCharacters.map(({ name }) => nameKey(name)));
const unmatchedAniList = aniList
  .filter(({ name }) => name.full && !matchedKeys.has(nameKey(ANILIST_NAME_FIXES[name.full] ?? name.full)))
  .sort((a, b) => (b.favourites ?? 0) - (a.favourites ?? 0))
  .slice(0, 40)
  .map(({ name, favourites }) => `${name.full} (${favourites})`);

const lastIncluded = selected.at(-1);
console.log(`
Personagens na Narutopedia:        ${apiCharacters.length}
Fora do mangá até o cap. ${LAST_CHAPTER}:      ${skipped.outsideManga}
Sem favoritos na AniList:          ${skipped.unpopular}
Excluídos à mão:                   ${skipped.excluded}
Candidatos válidos:                ${candidates.length}
Gravados:                          ${selected.length} (o último tem ${lastIncluded?.favourites ?? 0} favoritos)
Com foto:                          ${withFaces.filter(({ image }) => image).length}

Sem foto (ficam com as iniciais): ${failedFaces.join(', ') || '-'}
Sem sexo definido (ignorados): ${missingGender.join(', ') || '-'}
Sem afiliação (ficam com "Nenhum"): ${noAffiliation.join(', ') || '-'}
Afiliações sem tradução: ${[...unknownAffiliations].map(([name, n]) => `${name} (${n})`).join(', ') || '-'}
Mais de um clã (ficou o primeiro): ${multipleClans.join(' | ') || '-'}
Kekkei genkai sem tradução: ${[...unknownKekkeiGenkai].map(([name, n]) => `${name} (${n})`).join(', ') || '-'}
Habilidades: ${ABILITY_ORDER.map((ability) => {
  const owners = withFaces.filter(({ abilities }) => abilities.includes(ability));
  return `\n  ${ability} (${owners.length}): ${owners.map(({ name }) => name).join(', ')}`;
}).join('')}
Tipos de jutsu que contradizem naturezas ou habilidades: ${withFaces.flatMap(jutsuTypeProblems).join(', ') || '-'}
Sem tipos de jutsu em JUTSU_TYPES (ficam "Nenhum"): ${withFaces.filter(({ id }) => !(id in JUTSU_TYPES)).map(({ name }) => name).join(', ') || '-'}
Ids de JUTSU_TYPES sem personagem: ${Object.keys(JUTSU_TYPES).filter((id) => !seenIds.has(id)).join(', ') || '-'}
Achados por nome alternativo: ${viaAlternative.join(', ') || '-'}
AniList sem par na Narutopedia: ${unmatchedAniList.join(', ') || '-'}
`);
