export type Gender = 'Masculino' | 'Feminino';

export type ChakraNature = 'Fogo' | 'Vento' | 'Raio' | 'Terra' | 'Água';

/** Kekkei genkai, dōjutsu e outras habilidades especiais. */
export type Ability =
  | 'Sharingan'
  | 'Mangekyō'
  | 'Rinnegan'
  | 'Rinne Sharingan'
  | 'Byakugan'
  | 'Mokuton'
  | 'Hyōton'
  | 'Yōton'
  | 'Futton'
  | 'Ranton'
  | 'Bakuton'
  | 'Jiton'
  | 'Shakuton'
  | 'Jinton'
  | 'Shikotsumyaku'
  | 'Senninka'
  | 'Fusão Corporal'
  | 'Modo Sábio'
  | 'Jinchūriki'
  | 'Bijū'
  | 'Hiraishin'
  | 'Oito Portões'
  | 'Ninja Médico'
  | 'Invocação';

/** Os três grandes ramos de técnicas ninja. */
export type JutsuType = 'Taijutsu' | 'Ninjutsu' | 'Genjutsu';

/** Vilas e organizações. */
export type MainAffiliation =
  | 'Folha'
  | 'Areia'
  | 'Névoa'
  | 'Pedra'
  | 'Nuvem'
  | 'Chuva'
  | 'Cachoeira'
  | 'Grama'
  | 'Som'
  | 'Redemoinho'
  | 'Fontes Termais'
  | 'Akatsuki'
  | 'Raiz';

/** Países e lugares, usados só quando o personagem não tem vila nem organização. */
export type PlaceAffiliation =
  | 'País das Ondas'
  | 'País do Ferro'
  | 'País do Fogo'
  | 'País do Vento'
  | 'País da Terra'
  | 'País da Água'
  | 'País do Raio'
  | 'País das Fontes Termais'
  | 'Monte Myōboku'
  | 'Caverna Ryūchi'
  | 'Floresta Shikkotsu'
  | 'Templo do Fogo'
  | 'Lua';

export type Affiliation = MainAffiliation | PlaceAffiliation;

export type Series = 'Clássico' | 'Shippuden';

export interface Arc {
  id: string;
  name: string;
  series: Series;
  /** Primeiro e último capítulo do arco no mangá. */
  chapters: readonly [number, number];
}

export interface Character {
  id: string;
  name: string;
  /** Outros nomes aceitos na busca (ex: "Pain" para Nagato). */
  aliases?: readonly string[];
  /** Foto do rosto em public/, relativa à base do site (ex: "characters/naruto-uzumaki.webp"). */
  image?: string;
  gender: Gender;
  affiliations: readonly Affiliation[];
  /** "Nenhum" quando o personagem não pertence a um clã conhecido. */
  clan: string;
  /** Lista vazia quando o personagem não usa natureza de chakra (ex: Rock Lee). */
  natures: readonly ChakraNature[];
  debutArcId: Arc['id'];
  /** Lista vazia quando o personagem não tem habilidade especial. */
  abilities: readonly Ability[];
  /** Lista vazia para quem não usa técnicas ninja (ex: civis e samurais). */
  jutsuTypes: readonly JutsuType[];
}
