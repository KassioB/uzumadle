const ITEMS = [
  { glyph: '✓', cell: 'bg-hit text-ink', label: 'Igual' },
  { glyph: '≈', cell: 'bg-near text-ink', label: 'Em comum' },
  { glyph: '✕', cell: 'bg-miss text-white', label: 'Nada em comum' },
  { glyph: '↑', cell: 'bg-white text-ink', label: 'Estreou depois' },
  { glyph: '↓', cell: 'bg-white text-ink', label: 'Estreou antes' },
];

export function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pl-2" aria-label="Legenda">
      {ITEMS.map(({ glyph, cell, label }) => (
        <li key={label} className="mm-label flex items-center gap-2 text-white">
          <span
            aria-hidden="true"
            className={`grid h-5 w-7 -skew-x-12 place-items-center border border-ink text-[11px] font-black ${cell}`}
          >
            <span className="skew-x-12">{glyph}</span>
          </span>
          {label}
        </li>
      ))}
      <li className="mm-label">Guide · Toque numa célula para ler o resultado</li>
    </ul>
  );
}
