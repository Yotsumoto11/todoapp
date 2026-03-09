const API_BASE_URL = '';

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiClient<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `リクエストに失敗しました。(${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
