import { useEffect, useState } from 'react';
import { msUntilNextDay } from '../utils/gameLogic';

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

/** Tempo até a meia-noite local, quando troca o personagem do dia. */
export function Countdown() {
  const [remaining, setRemaining] = useState(msUntilNextDay);

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(msUntilNextDay()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="nd-outline block text-4xl leading-none font-black text-scarlet tabular-nums italic sm:text-5xl">
      {format(remaining)}
    </span>
  );
}
