import { useEffect, useRef } from 'react';

const STATES = [
  { glyph: '✓', cell: 'bg-hit text-ink', label: 'Igual', text: 'o atributo é o mesmo do ninja escondido.' },
  {
    glyph: '≈',
    cell: 'bg-near text-ink',
    label: 'Em comum',
    text: 'listas com algo em comum: uma vila, um elemento, um atributo, um tipo de jutsu.',
  },
  { glyph: '✕', cell: 'bg-miss text-white', label: 'Nada em comum', text: 'nenhuma relação.' },
  { glyph: '↑', cell: 'bg-white text-ink', label: 'Estreia', text: 'a seta diz se o certo estreou depois (↑) ou antes (↓).' },
];

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

/** Regras numa janela nativa: fecha no Esc, no ✕ e num clique que começa e termina fora do painel. */
export function HowToPlay({ open, onClose }: HowToPlayProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pressedOutside = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="como-jogar"
      className="mm-dialog m-auto"
      onClose={onClose}
      onMouseDown={(e) => (pressedOutside.current = e.target === dialog.current)}
      onClick={(e) => {
        if (pressedOutside.current && e.target === dialog.current) onClose();
      }}
    >
      <div className="flex items-start justify-between gap-4 px-7 pt-6">
        <h2 id="como-jogar" className="mm-display nd-outline -rotate-3 text-5xl text-scarlet">
          Como
          <br />
          <span className="text-orange">jogar</span>
        </h2>
        <button type="button" onClick={onClose} aria-label="Fechar" className="mm-btn px-3">
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="flex flex-col gap-5 px-7 pt-5 pb-12">
        <p className="text-steel">
          Escreva o nome de um ninja. Cada palpite vira uma faixa que compara gênero, afiliação,
          clã, elemento, estreia, atributos e tipo de jutsu com o ninja escondido.
        </p>

        <ul className="flex flex-col gap-2">
          {STATES.map(({ glyph, cell, label, text }, i) => (
            <li key={label} className="mm-row" style={{ marginLeft: `${i * 10}px` }}>
              <span className={`grid size-7 shrink-0 place-items-center font-black ${cell}`} aria-hidden="true">
                {glyph}
              </span>
              <span className="text-sm">
                <strong className="font-black uppercase italic">{label}:</strong> {text}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-sm text-steel">
          Passe o mouse ou toque numa célula para ler o resultado. Com 3 palpites libera a inicial
          do nome; com 6, a silhueta. Aperte <kbd className="font-black text-ink">/</kbd> para ir
          direto à busca.
        </p>
        <p className="mm-label">Guide · Diário: um ninja por dia · Infinito: quantos quiser</p>
      </div>
    </dialog>
  );
}
