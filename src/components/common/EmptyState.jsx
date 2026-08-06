import { SearchX } from 'lucide-react';
export function EmptyState({ title = 'Nothing found', text = 'Try a different search or filter.' }) {
  return <div className="empty-state"><SearchX size={42} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>;
}
