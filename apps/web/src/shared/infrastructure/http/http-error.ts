export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }

  parsedMessage(): string {
    try {
      const parsed = JSON.parse(this.message);
      if (Array.isArray(parsed.message)) return parsed.message.join(', ');
      return parsed.message ?? this.message;
    } catch {
      return this.message;
    }
  }
}
