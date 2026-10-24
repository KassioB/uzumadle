import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { characterNumber } from '../data/characters';
import type { Character } from '../types/character';
import { normalize } from '../utils/gameLogic';
import { Avatar } from './Avatar';

/** Teto da lista; acima da altura máxima ela rola. */
const MAX_SUGGESTIONS = 50;

interface Suggestion {
  character: Character;
  /** O que aparece na lista: o nome, ou o apelido que bateu (ex: "Pain"). */
  label: string;
  /** Nome real, mostrado ao lado quando quem bateu foi um apelido. */
  realName: string | null;
}

/**
 * Só entra quem tem o nome (ou um apelido) começando com o texto digitado,
 * na ordem de popularidade da lista.
 */
function findSuggestions(
  characters: readonly Character[],
  excludedIds: ReadonlySet<string>,
  query: string,
): Suggestion[] {
  const term = normalize(query);
  if (!term) return [];

  const found: Suggestion[] = [];
  for (const character of characters) {
    if (found.length === MAX_SUGGESTIONS) break;
    if (excludedIds.has(character.id)) continue;
    if (normalize(character.name).startsWith(term)) {
      found.push({ character, label: character.name, realName: null });
      continue;
    }
    const alias = character.aliases?.find((name) => normalize(name).startsWith(term));
    if (alias) found.push({ character, label: alias, realName: character.name });
  }
  return found;
}

interface CharacterInputProps {
  /** id do campo, para o botão do topo e o atalho "/" focarem nele. */
  id: string;
  characters: readonly Character[];
  /** Personagens já chutados, que somem das sugestões. */
  excludedIds: ReadonlySet<string>;
  onSelect: (character: Character) => void;
}

export function CharacterInput({ id, characters, excludedIds, onSelect }: CharacterInputProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const suggestions = useMemo(
    () => findSuggestions(characters, excludedIds, query),
    [characters, excludedIds, query],
  );
  // Quantos caracteres do começo do nome destacar.
  const typedLength = normalize(query).length;

  const showList = open && suggestions.length > 0;
  const activeOptionId = showList ? `${listId}-opt-${activeIndex}` : undefined;

  // Com a lista longa, a opção escolhida pelas setas precisa continuar visível.
  useEffect(() => {
    if (activeOptionId) document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
  }, [activeOptionId]);

  // Atalho "/": vai direto para a busca, de qualquer ponto da página.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key !== '/' || target?.closest('input, textarea, [contenteditable]')) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function choose(character: Character | undefined) {
    if (!character) return;
    onSelect(character);
    setQuery('');
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (showList) choose(suggestions[activeIndex]?.character);
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {/* A barra de busca é uma faixa branca inclinada, com a lasca vermelha na ponta. */}
        <label className="mm-input flex flex-1 -skew-x-12 items-center gap-3 border-2 border-ink bg-white px-5 shadow-[inset_-8px_0_0_var(--scarlet),4px_4px_0_var(--ink)]">
          <span className="sr-only">Nome do ninja</span>
          <span aria-hidden="true" className="skew-x-12 text-xl font-black text-ink italic">
            ⌕
          </span>
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            spellCheck={false}
            placeholder="Escreva o nome de um ninja…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={handleKeyDown}
            className="w-full skew-x-12 bg-transparent py-3.5 text-lg font-bold text-ink italic placeholder:font-semibold placeholder:text-steel focus:outline-none"
          />
          <kbd aria-hidden="true" className="hidden skew-x-12 border-2 border-ink px-2 text-xs font-black text-ink sm:inline-block">
            /
          </kbd>
        </label>
        <button
          type="button"
          disabled={suggestions.length === 0}
          onClick={() => choose(suggestions[activeIndex]?.character)}
          className="mm-btn mm-btn--primary px-8 py-3 text-lg"
        >
          <span>Palpite ▸</span>
        </button>
      </div>

      {/* Sugestões: faixas brancas inclinadas, número numa caixinha. */}
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-3 flex max-h-96 w-full flex-col gap-1.5 overflow-y-auto border-2 border-orange bg-ink/90 px-5 py-4"
        >
          {suggestions.map(({ character, label, realName }, index) => (
            <li
              key={character.id}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              // mousedown em vez de click: escolhe antes do blur fechar a lista.
              onMouseDown={(e) => {
                e.preventDefault();
                choose(character);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className="mm-row cursor-pointer py-1.5 pl-2"
            >
              <span className="grid min-w-14 place-items-center border-2 border-current px-1 text-sm font-black italic">
                {characterNumber(character.id)}
              </span>
              <Avatar character={character} size="sm" />
              <span className="truncate text-xl font-black uppercase italic">
                <span className="text-scarlet">{label.slice(0, typedLength)}</span>
                {label.slice(typedLength)}
              </span>
              {realName && <span className="mm-label ml-auto truncate">{realName}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
