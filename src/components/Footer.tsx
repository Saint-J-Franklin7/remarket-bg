import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.jpeg" alt="РеМаркет" width={44} height={44} className="rounded-full object-cover" />
            <span className="font-bold text-xl">Ре<span className="text-brand">Маркет</span></span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed mb-3">
            Качествени продукти на достъпна цена. Бърза доставка с Еконт и Спиди до всяка точка в страната.
          </p>
          <p className="text-xs text-white/30">www.remarketbg.com</p>
        </div>

        <div>
          <h3 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">Навигация</h3>
          <ul className="space-y-2.5 text-sm">
            {[['/', 'Начало'], ['/#categories', 'Категории'], ['/checkout', 'Количка']].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white/70 hover:text-brand transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="contact">
          <h3 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">Доставка & Контакт</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Доставяме с <strong className="text-white">Еконт</strong> и <strong className="text-white">Спиди</strong>.<br />
            Плащане при получаване — наложен платеж.
          </p>
          <div className="flex gap-2">
            <span className="bg-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold">Еконт</span>
            <span className="bg-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold">Спиди</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-white/30">
          © {new Date().getFullYear()} РеМаркет — www.remarketbg.com. Всички права запазени.
        </p>
      </div>
    </footer>
  )
}
