import { AlertTriangle } from 'lucide-react';

export default function AlertBar({ message }) {
  // Ritorna null se non c'è alcun messaggio, evitando di renderizzare un box vuoto
  if (!message) return null;

  return (
    <div 
      className="alert-bar" 
      role="alert" 
      aria-live="polite"
    >
      <AlertTriangle size={14} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}