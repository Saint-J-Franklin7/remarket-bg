import { Resend } from 'resend'
import { Order } from './types'

const FROM = 'РеМаркет <noreply@remarketbg.com>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function trackingLink(order: Order): string {
  if (!order.trackingNumber) return ''
  const url = order.delivery.courier === 'speedy'
    ? `https://www.speedy.bg/en/track-shipment/?shipmentNumber=${order.trackingNumber}`
    : `https://www.econt.com/services/track-shipment/${order.trackingNumber}`
  return `
    <div style="margin-top:16px;padding:12px 16px;background:#EEF6FF;border-radius:8px;border:1px solid #BFDBFE;">
      <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Номер за проследяване</p>
      <p style="margin:0;font-size:16px;font-weight:700;color:#0096D6;">${order.trackingNumber}</p>
      <a href="${url}" style="display:inline-block;margin-top:8px;background:#0096D6;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">
        Проследи пратката →
      </a>
    </div>`
}

export async function sendOrderConfirmationToCustomer(order: Order) {
  const courierName = order.delivery.courier === 'econt' ? 'Еконт' : 'Спиди'
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
          <p style="color:#64748b;margin:0 0 24px;">Здравейте <strong>${order.customer.name}</strong>, ще ви се обадим на <strong>${order.customer.phone}</strong> за потвърждение.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-weight:700;font-size:16px;">Общо</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:18px;color:#0096D6;">${order.total.toFixed(2)} €</td>
            </tr>
          </table>

          <p style="font-size:12px;color:#9ca3af;margin:4px 0 20px;">Плащате при получаване — наложен платеж</p>

          <div style="background:#F7FAFF;border-radius:8px;padding:16px;border:1px solid #E2EAF4;">
            <p style="margin:0 0 6px;font-size:14px;"><strong>Куриер:</strong> ${courierName}</p>
            <p style="margin:0 0 6px;font-size:14px;"><strong>Офис:</strong> ${order.delivery.officeName}</p>
            <p style="margin:0;font-size:14px;"><strong>Адрес:</strong> ${order.delivery.officeAddress}</p>
          </div>

          ${trackingLink(order)}
        </div>
      </div>
    `,
  })
}

export async function sendNewOrderToSeller(order: Order, waybillPdf?: string | null) {
  const courierName = order.delivery.courier === 'econt' ? 'Еконт' : 'Спиди'
  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;color:#374151;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;color:#6b7280;">× ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${(i.price * i.quantity).toFixed(2)} €</td>
    </tr>`).join('')

  const econtManualNote = order.delivery.courier === 'econt' && !order.trackingNumber
    ? `<div style="margin-top:16px;padding:12px 16px;background:#FFF7ED;border-radius:8px;border:1px solid #FED7AA;">
        <p style="margin:0;font-size:13px;color:#92400E;">⚠️ <strong>Еконт:</strong> Създайте ръчно товарителница на <a href="https://delivery.econt.com" style="color:#0096D6;">delivery.econt.com</a></p>
      </div>`
    : ''

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
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Поръчка №${order.id.substring(0, 8).toUpperCase()}</p>

          <div style="background:#F7FAFF;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #E2EAF4;">
            <p style="margin:0 0 6px;font-size:14px;"><strong>Клиент:</strong> ${order.customer.name}</p>
            <p style="margin:0 0 6px;font-size:14px;"><strong>Телефон:</strong> <a href="tel:${order.customer.phone}" style="color:#0096D6;font-weight:700;">${order.customer.phone}</a></p>
            <p style="margin:0 0 6px;font-size:14px;"><strong>Email:</strong> ${order.customer.email}</p>
            <p style="margin:0 0 6px;font-size:14px;"><strong>Куриер:</strong> ${courierName}</p>
            <p style="margin:0 0 6px;font-size:14px;"><strong>Офис:</strong> ${order.delivery.officeName}</p>
            <p style="margin:0;font-size:14px;"><strong>Адрес:</strong> ${order.delivery.officeAddress}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:12px 0 0;font-weight:700;font-size:18px;">Общо (наложен платеж)</td>
              <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:20px;color:#0096D6;">${order.total.toFixed(2)} €</td>
            </tr>
          </table>

          ${trackingLink(order)}
          ${econtManualNote}
        </div>
      </div>
    `,
    text: `Нова поръчка!\nКлиент: ${order.customer.name}\nТелефон: ${order.customer.phone}\nКуриер: ${courierName} — ${order.delivery.officeName}\nОбщо: ${order.total.toFixed(2)} €${order.trackingNumber ? `\nTracking: ${order.trackingNumber}` : ''}`,
    attachments: waybillPdf ? [{
      content: waybillPdf,
      filename: `waybill-${order.trackingNumber}.pdf`,
      type: 'application/pdf',
    }] : undefined,
  })
}
