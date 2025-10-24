/**
 * 공용 API 호출 헬퍼
 * - 기본으로 /api 프리픽스 사용
 * - body가 있으면 JSON 직렬화
 * - Authorization 헤더는 인자로 받은 token 또는 localStorage의 token을 사용
 * - 실패시 Error throw (message/ status 포함)
 */
export async function api(path, { method = 'GET', body, token } = {}) {
  const saved = (() => {
    try { return localStorage.getItem('token'); } catch { return null; }
  })();

  const headers = {
    'Content-Type': 'application/json',
    ...(token || saved ? { Authorization: `Bearer ${token || saved}` } : {}),
  };

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try { data = await res.json(); } catch (_) {}

  if (!res.ok) {
    const err = new Error(data?.message || '요청을 처리하지 못했습니다.');
    err.status = res.status;
    throw err;
  }
  return data;
}

// 기본(default) 내보내기도 같이 제공해서 두 import 방식 모두 동작
export default api;
