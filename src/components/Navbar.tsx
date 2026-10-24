import { SpiralMark } from './SpiralMark';

interface NavbarProps {
  /** "Dia #023 · 23 out 2026" no diário, "Treino livre" no infinito. */
  dayLabel: string;
  dayCaption: string;
}

/** Topo: a marca e, ao lado, o chip preto com a data. */
export function Navbar({ dayLabel, dayCaption }: NavbarProps) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 pt-5 sm:px-6">
      <a href="#topo" className="flex items-center gap-3">
        <SpiralMark className="size-10 drop-shadow-[3px_3px_0_#0a0a14]" />
        <span className="nd-outline text-2xl font-black tracking-tight uppercase italic sm:text-3xl">
          <span className="text-orange">Uzuma</span>
          <span className="text-scarlet">dle</span>
        </span>
      </a>
      <div className="-skew-x-12 bg-ink px-3 py-1">
        <div className="skew-x-12">
          <p className="text-sm font-black text-white italic">{dayLabel}</p>
          <p className="text-[10px] font-semibold text-white/70 italic">{dayCaption}</p>
        </div>
      </div>
    </header>
  );
}
