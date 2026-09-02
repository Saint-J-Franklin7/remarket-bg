import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Данни за търговеца — РеМаркет',
  description: 'Информация за търговеца, администриращ онлайн магазин РеМаркет.',
}

export default function CompanyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 w-full">
      <h1 className="text-2xl md:text-3xl font-black text-dark mb-8">Данни за търговеца</h1>

      <div className="bg-surface border border-border rounded-2xl p-6 text-sm text-gray-600 leading-relaxed space-y-2">
        <p><strong className="text-dark">Търговско наименование:</strong> [ще бъде допълнено]</p>
        <p><strong className="text-dark">ЕИК / БУЛСТАТ:</strong> [ще бъде допълнено]</p>
        <p><strong className="text-dark">Седалище и адрес на управление:</strong> [ще бъде допълнено]</p>
        <p><strong className="text-dark">Адрес за упражняване на дейността:</strong> [ще бъде допълнено]</p>
        <p><strong className="text-dark">Имейл за контакт:</strong> [ще бъде допълнено]</p>
        <p><strong className="text-dark">Телефон за контакт:</strong> [ще бъде допълнено]</p>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Онлайн магазинът www.remarketbg.com се администрира от търговеца, посочен по-горе.
        Пълните данни ще бъдат публикувани веднага след финализиране на регистрацията на дружеството.
      </p>
    </main>
  )
}
