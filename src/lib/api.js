export async function api(path, { method='GET', body, token } = {}) {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    });

    const ct = res.headers.get('content-type') || '';
    const isJson = ct.includes('application/json');
    const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const code = isJson && payload?.code ? payload.code : (res.status === 404 ? 'E_NOT_FOUND' : 'E_UNKNOWN');
      const message = isJson && payload?.message ? payload.message : (typeof payload === 'string' ? payload : '');
      const err = new Error(message || 'Request failed');
      err.code = code;
      err.status = res.status;
      throw err;
    }
    return isJson ? payload : { ok:true, data: payload };
  } catch (e) {
    // 네트워크/비JSON/파싱 실패 모두 여기로
    const err = e instanceof Error ? e : new Error('Network error');
    if (!err.code) err.code = 'E_NETWORK';
    throw err;
  }
}
