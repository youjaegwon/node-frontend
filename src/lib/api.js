import { toUserMessage } from './errorMap'

export async function api(path, { method='GET', body, token } = {}) {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })

    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? await res.json() : await res.text()

    if (!res.ok || (data && data.ok === false)) {
      const code = (data && data.code) || `HTTP_${res.status}`
      const rawMsg = (data && data.message) || 'Request failed'
      const userMessage = toUserMessage(code, rawMsg)
      const e = new Error(userMessage)
      e.code = code
      e.raw = data
      throw e
    }

    return ct.includes('application/json') ? data : { ok: true, data }
  } catch (e) {
    if (!e.code) {
      e.code = 'NETWORK_ERROR'
      e.message = toUserMessage('NETWORK_ERROR')
    }
    throw e
  }
}
