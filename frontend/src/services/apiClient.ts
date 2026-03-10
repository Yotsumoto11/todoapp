const API_BASE_URL = '';

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiClient<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  // Temporary debug logs for tracing 404 and proxy routing issues.
  console.log('request url:', url);

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined
  });

  console.log('response status:', response.status);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `リクエストに失敗しました。(${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
