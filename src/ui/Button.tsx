import type { ReactNode } from 'react';
export function Button({ href, variant = 'primary', size, children, onClick }: { href: string; variant?: 'primary' | 'ghost'; size?: 'sm'; children: ReactNode; onClick?: () => void }) {
  const ext = /^https?:/.test(href);
  return (
    <a className={`btn ${variant} ${size ?? ''}`} href={href} onClick={onClick} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>
      {children}<span className="arr" aria-hidden="true">→</span>
    </a>
  );
}
