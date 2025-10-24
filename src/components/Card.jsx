import React from 'react';

export default function Card({ as:As='div', href, onClick, children, className='' }) {
  const cls = "block bg-white rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md hover:-translate-y-0.5 transition p-4 " + className;
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>;
  }
  if (onClick) {
    return <button onClick={onClick} className={cls}>{children}</button>;
  }
  return <As className={cls}>{children}</As>;
}
