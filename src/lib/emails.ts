import { Resend } from 'resend'
import { Order } from './types'

const FROM = 'РеМаркет <noreply@remarketbg.com>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendOrderConfirmationToCustomer(order: Order) {
  const courierName = order.delivery.courier === 'econt' ? 'Еконт' : order.delivery.courier === 'speedy' ? 'Спиди' : 'Доставка до адрес'
  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#374151;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;color:#6b7280;">× ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${(i.price * i.quantity).toFixed(2)} €</td>
    </tr>`).join('')

  await getResend().emails.send({
    from: FROM,
    to: order.customer.email,
    subject: `Поръчка №${order.id.substring(0, 8).toUpperCase()} — потвърждение`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A;">
        <div style="background:#1A2B8E;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">РеМаркет</h1>
          <p style="color:#93c5fd;margin:4px 0 0;font-size:13px;">www.remarketbg.com</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #E2EAF4;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 8px;font-size:20px;">Поръчката е приета! ✅</h2>
          <p style="color:#64748b;margin:0 0 24px;">
            Здравейте <strong>${order.customer.name}</strong>,<br>
            получихме вашата поръчка. Ще се свържем с вас на <strong>${order.customer.phone}</strong> за потвърждение и уточняване на детайлите.
          </p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-weight:700;font-size:16px;">Общо</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:18px;color:#1A2B8E;">${order.total.toFixed(2)} €</td>
            </tr>
          </table>
          <p style="font-size:12px;color:#9ca3af;margin:4px 0 24px;">Плащате при получаване — наложен платеж</p>

          <div style="background:#F7FAFF;border-radius:8px;padding:16px;border:1px solid #E2EAF4;">
            <p style="margin:0 0 6px;font-size:14px;"><strong>Доставка:</strong> ${courierName}</p>
            ${order.delivery.courier === 'home'
              ? `<p style="margin:0;font-size:14px;"><strong>Адрес:</strong> ${order.delivery.homeAddress}</p>`
              : `<p style="margin:0 0 6px;font-size:14px;"><strong>Офис:</strong> ${order.delivery.officeName}</p>
            <p style="margin:0;font-size:14px;"><strong>Адрес:</strong> ${order.delivery.officeAddress}</p>`
            }
          </div>

          <p style="color:#64748b;font-size:13px;margin-top:24px;text-align:center;">
            Благодарим за доверието! — РеМаркет
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendNewOrderToSeller(order: Order) {
  const courierName = order.delivery.courier === 'econt' ? 'Еконт' : order.delivery.courier === 'speedy' ? 'Спиди' : 'Доставка до адрес'
  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#374151;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;color:#6b7280;">× ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${(i.price * i.quantity).toFixed(2)} €</td>
    </tr>`).join('')

  await getResend().emails.send({
    from: FROM,
    to: process.env.SELLER_EMAIL!,
    subject: `🛒 Нова поръчка — ${order.total.toFixed(2)} € — ${order.customer.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A;">
        <div style="background:#1A2B8E;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">🛒 Нова поръчка!</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #E2EAF4;border-top:none;border-radius:0 0 12px 12px;">

          <div style="background:#F0F4FF;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #C7D2FE;">
            <p style="margin:0 0 8px;font-size:15px;"><strong>👤 Клиент:</strong> ${order.customer.name}</p>
            <p style="margin:0 0 8px;font-size:15px;"><strong>📞 Телефон:</strong> <a href="tel:${order.customer.phone}" style="color:#1A2B8E;font-weight:700;">${order.customer.phone}</a></p>
            <p style="margin:0 0 8px;font-size:15px;"><strong>📧 Email:</strong> ${order.customer.email}</p>
            <p style="margin:0 0 8px;font-size:15px;"><strong>🚚 Доставка:</strong> ${courierName}</p>
            ${order.delivery.courier === 'home'
              ? `<p style="margin:0;font-size:15px;"><strong>🏠 Адрес:</strong> ${order.delivery.homeAddress}</p>`
              : `<p style="margin:0 0 8px;font-size:15px;"><strong>📦 Офис:</strong> ${order.delivery.officeName}</p>
            <p style="margin:0;font-size:15px;"><strong>📍 Адрес:</strong> ${order.delivery.officeAddress}</p>`
            }
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-weight:700;font-size:18px;">Общо (наложен платеж)</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:22px;color:#1A2B8E;">${order.total.toFixed(2)} €</td>
            </tr>
          </table>

          <p style="font-size:12px;color:#9ca3af;margin-top:8px;">Поръчка №${order.id.substring(0, 8).toUpperCase()} — ${new Date(order.createdAt).toLocaleString('bg-BG')}</p>
        </div>
      </div>
    `,
    text: `Нова поръчка!\nКлиент: ${order.customer.name}\nТелефон: ${order.customer.phone}\nEmail: ${order.customer.email}\nДоставка: ${courierName}${order.delivery.courier === 'home' ? `\nАдрес: ${order.delivery.homeAddress}` : `\nОфис: ${order.delivery.officeName}\nАдрес: ${order.delivery.officeAddress}`}\n\n${order.items.map(i => `${i.name} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`).join('\n')}\n\nОбщо: ${order.total.toFixed(2)} €`,
  })
}
