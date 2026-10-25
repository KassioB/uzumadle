import type { ReactNode } from 'react';

const LINKS: { href: string; label: string; title: string; icon: ReactNode }[] = [
  {
    href: 'https://www.linkedin.com/in/kassiobcunha/',
    label: 'LinkedIn de KassioBC (abre em nova aba)',
    title: 'LinkedIn',
    icon: (
      <path
        d="M6.5 10.5V18M6.5 6.5v.01M11 18v-7.5M11 14c0-2.2 1.4-3.5 3.2-3.5s3.3 1.2 3.3 3.5V18"
        strokeWidth={2.4}
      />
    ),
  },
  {
    href: 'https://portfolio-web-kassiob.vercel.app/',
    label: 'Portfólio de KassioBC (abre em nova aba)',
    title: 'Portfólio',
    icon: (
      <g strokeWidth={2}>
        <rect x="3" y="7" width="18" height="13" rx="2.5" />
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" />
      </g>
    ),
  },
];

/** Assinatura do rodapé: "Desenvolvido por KassioBC" com LinkedIn e portfólio. */
export function DevCredit() {
  return (
    <p className="mm-label flex shrink-0 items-center gap-1.5 text-[10px]! whitespace-nowrap normal-case">
      © 2026 · Desenvolvido por
      <span className="font-black text-orange not-italic">KassioBC</span>
      {LINKS.map(({ href, label, title, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={title}
          className="inline-flex size-6 -skew-x-12 items-center justify-center border-2 border-orange bg-ink text-white transition-colors hover:bg-orange hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5 skew-x-12"
          >
            {icon}
          </svg>
        </a>
      ))}
    </p>
  );
}
