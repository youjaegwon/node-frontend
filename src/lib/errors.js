const KOREAN_MESSAGES = {
  E_AUTH_INVALID: '아이디 또는 비밀번호가 올바르지 않습니다.',
  E_VALIDATION  : '입력값을 확인해주세요.',
  E_UNKNOWN     : '알 수 없는 오류가 발생했습니다.',
};
export function toKoreanMessage(err) {
  if (!err) return KOREAN_MESSAGES.E_UNKNOWN;
  if (typeof err === 'string') return err;
  const code = err.code || 'E_UNKNOWN';
  return KOREAN_MESSAGES[code] || err.message || KOREAN_MESSAGES.E_UNKNOWN;
}
