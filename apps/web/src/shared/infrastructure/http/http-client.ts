import { HttpError } from './http-error';

export class HttpClient {
  constructor(private readonly _baseUrl: string) {}

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = this._build(path, params);
    const res = await fetch(url);
    if (!res.ok) throw new HttpError(res.status, await res.text());
    return res.json();
  }

  async post<B, T>(path: string, body: B): Promise<T> {
    const res = await fetch(`${this._baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new HttpError(res.status, await res.text());
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  async patch<B, T>(path: string, body: B, params?: Record<string, string>): Promise<T> {
    const url = this._build(path, params);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new HttpError(res.status, await res.text());
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  async delete<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = this._build(path, params);
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new HttpError(res.status, await res.text());
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  private _build(path: string, params?: Record<string, string>): string {
    let url = `${this._baseUrl}${path}`;
    if (params && Object.keys(params).length > 0) {
      url += '?' + new URLSearchParams(params).toString();
    }
    return url;
  }
}
