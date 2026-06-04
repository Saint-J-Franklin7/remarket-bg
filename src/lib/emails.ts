import { Resend } from 'resend'
import { Order } from './types'

const FROM = 'РеМаркет <noreply@remarketbg.com>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendOrderConfirmationToCustomer(order: Order) {
  const courierName = order.delivery.courier === 'econt' ? 'Еконт' : 'Спиди'
  const itemsHtml = order.items
    .map(i => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">× ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${(i.price * i.quantity).toFixed(2)} лв.</td>
    </tr>`)
    .join('')

  const trackingHtml = order.trackingNumber
    ? `<p style="margin:16px 0 0;">Номер за проследяване: <strong style="color:#0096D6;">${order.trackingNumber}</strong></p>`
    : ''

  await getResend().emails.send({
    from: FROM,
    to: order.customer.email,
    subject: `Поръчка №${order.id.substring(0, 8).toUpperCase()} — потвърждение`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A;">
        <div style="background:#1A2B8E;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">РеМаркет</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #E2EAF4;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 8px;font-size:20px;">Поръчката е приета! ✅</h2>
          <p style="color:#64748b;margin:0 0 24px;">Здравейте ${order.customer.name}, ще ви се обадим за потвърждение.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-weight:700;font-size:16px;">Общо</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px;">${order.total.toFixed(2)} лв.</td>
            </tr>
          </table>

          <div style="background:#F7FAFF;border-radius:8px;padding:16px;margin-top:16px;">
            <p style="margin:0 0 6px;"><strong>Куриер:</strong> ${courierName}</p>
            <p style="margin:0 0 6px;"><strong>Офис:</strong> ${order.delivery.officeName}</p>
            <p style="margin:0;"><strong>Адрес:</strong> ${order.delivery.officeAddress}</p>
            ${trackingHtml}
          </div>

          <p style="color:#64748b;font-size:13px;margin-top:24px;">Плащане при получаване — наложен платеж.</p>
        </div>
      </div>
    `,
  })
}

export async function sendNewOrderToSeller(order: Order) {
  const courierName = order.delivery.courier === 'econt' ? 'Еконт' : 'Спиди'
  const itemsList = order.items
    .map(i => `${i.name} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} лв.`)
    .join('\n')

  const itemsHtml = order.items
    .map(i => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">× ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${(i.price * i.quantity).toFixed(2)} лв.</td>
    </tr>`)
    .join('')

  await getResend().emails.send({
    from: FROM,
    to: process.env.SELLER_EMAIL!,
    subject: `🛒 Нова поръчка — ${order.total.toFixed(2)} лв. — ${order.customer.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A;">
        <div style="background:#1A2B8E;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">🛒 Нова поръчка!</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #E2EAF4;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Поръчка №${order.id.substring(0, 8).toUpperCase()}</p>

          <div style="background:#F7FAFF;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 6px;"><strong>Клиент:</strong> ${order.customer.name}</p>
            <p style="margin:0 0 6px;"><strong>Телефон:</strong> <a href="tel:${order.customer.phone}" style="color:#0096D6;">${order.customer.phone}</a></p>
            <p style="margin:0 0 6px;"><strong>Куриер:</strong> ${courierName}</p>
            <p style="margin:0 0 6px;"><strong>Офис:</strong> ${order.delivery.officeName}</p>
            <p style="margin:0;"><strong>Адрес на офис:</strong> ${order.delivery.officeAddress}</p>
            ${order.trackingNumber ? `<p style="margin:8px 0 0;"><strong>Tracking №:</strong> <span style="color:#0096D6;">${order.trackingNumber}</span></p>` : ''}
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-weight:700;font-size:18px;">Общо (наложен платеж)</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:18px;color:#0096D6;">${order.total.toFixed(2)} лв.</td>
            </tr>
          </table>
        </div>
      </div>
    `,
    text: `Нова поръчка!\n\nКлиент: ${order.customer.name}\nТелефон: ${order.customer.phone}\nКуриер: ${courierName} — ${order.delivery.officeName}\n\n${itemsList}\n\nОбщо: ${order.total.toFixed(2)} лв.`,
  })
}
