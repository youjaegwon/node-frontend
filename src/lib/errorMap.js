const MAP = {
  // 인증
  E_AUTH_INVALID: '이메일 또는 비밀번호가 올바르지 않습니다.',
  E_AUTH_REQUIRED: '로그인이 필요합니다.',
  // 회원가입
  E_USER_EXISTS: '이미 가입된 이메일입니다.',
  E_VALIDATION: '입력값을 다시 확인해주세요.',
  // 공통
  E_NOT_FOUND: '요청하신 항목을 찾을 수 없습니다.',
  E_NETWORK: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  E_UNKNOWN: '알 수 없는 오류가 발생했습니다.'
};
export function toMessage(code, fallback) {
  return MAP[code] || fallback || MAP.E_UNKNOWN;
}
