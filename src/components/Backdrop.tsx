const base = import.meta.env.BASE_URL;

/**
 * Céu de anime em tela cheia com o Naruto de costas no canto direito.
 * No celular a imagem é cortada puxando para a direita, para o Naruto continuar à vista.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[#1450d8]">
      <img
        src={`${base}backdrop/4knaruto.jpg`}
        alt=""
        fetchPriority="high"
        className="size-full object-cover object-[85%_60%] md:object-[50%_60%]"
      />
    </div>
  );
}
