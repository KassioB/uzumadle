import type { ComponentPropsWithoutRef } from 'react';

/**
 * Caixa branca da arte de referência: borda laranja, canto inferior direito cortado, sombra preta
 * dura para a direita e para baixo, halftone preto por fora da borda esquerda e um xadrez cinza
 * claro por dentro, no canto de baixo. O formato vem de camadas decorativas recortadas com
 * clip-path (ver .nd-card no CSS), então o conteúdo, como uma lista que sai da caixa, nunca é cortado.
 */
export function Card({ className = '', children, ...rest }: ComponentPropsWithoutRef<'section'>) {
  return (
    <section className={`nd-card ${className}`} {...rest}>
      <span aria-hidden="true" className="nd-card__halftone" />
      <span aria-hidden="true" className="nd-card__shadow" />
      <span aria-hidden="true" className="nd-card__frame" />
      <span aria-hidden="true" className="nd-card__paper" />
      <div className="nd-card__body">{children}</div>
    </section>
  );
}
