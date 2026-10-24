import { useState } from 'react';
import type { Character } from '../types/character';

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-24 text-3xl',
} as const;

function initials(name: string): string {
  const words = name.replace(/\(.*?\)/g, '').trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

interface AvatarProps {
  character: Character;
  size?: keyof typeof SIZES;
  /** Classes extras, como um filtro para a dica de silhueta. */
  className?: string;
}

/**
 * Foto do rosto, quadrada, com borda preta. Sem foto, ou se ela não carregar, mostra as
 * iniciais. É decorativa: o nome aparece ao lado.
 */
export function Avatar({ character, size = 'md', className = '' }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = character.image ? import.meta.env.BASE_URL + character.image : null;
  const base = `${SIZES[size]} inline-flex shrink-0 items-center justify-center overflow-hidden border-2 border-ink ${className}`;

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailedSrc(src)}
        className={`${base} bg-ink object-cover`}
      />
    );
  }

  return (
    <span aria-hidden="true" className={`${base} bg-ink font-black text-white italic`}>
      {initials(character.name)}
    </span>
  );
}
