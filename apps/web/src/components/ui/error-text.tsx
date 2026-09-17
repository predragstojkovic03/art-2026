import type { ReactNode } from 'react';

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-red-600 mt-1">{children}</p>;
}
