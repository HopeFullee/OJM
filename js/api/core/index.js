const BASE_URL = import.meta.env.VITE_API_END_POINT;

async function request(method, path, body) {
  const response = await fetch(BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`${method} ${path} 실패: ${response.status}`);
  }

  // DELETE 등에서 응답 본문이 없는 경우
  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
};
