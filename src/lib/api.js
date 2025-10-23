import { toUserMessage } from './errorMap'

export async function api(path, { method='GET', body, token } = {}) {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })

    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? await res.json() : await res.text()

    // 백엔드 표준 {ok:false,code,message} 지원 + HTTP 에러 처리
    if (!res.ok || (data && data.ok === false)) {
      const code = (data && data.code) || `HTTP_${res.status}`
      const rawMsg = (data && data.message) || '요청이 실패했습니다.'
      const userMsg = toUserMessage(code, rawMsg)
      const e = new Error(userMsg)
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
