export const ERROR_KR = {
  AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  AUTH_BLOCKED: '차단된 계정입니다. 관리자에게 문의해주세요.',
  EMAIL_TAKEN: '이미 가입된 이메일입니다.',
  PASSWORD_TOO_SHORT: '비밀번호는 8자 이상이어야 합니다.',
  VALIDATION_REQUIRED: '필수 항목을 입력해주세요.',
  HTTP_401: '인증이 필요합니다.',
  HTTP_403: '접근 권한이 없습니다.',
  HTTP_404: '요청한 리소스를 찾을 수 없습니다.',
  HTTP_429: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  DEFAULT: '문제가 발생했습니다. 다시 시도해주세요.',
}
export function toUserMessage(code, fallback) {
  return ERROR_KR[code] || fallback || ERROR_KR.DEFAULT
}
