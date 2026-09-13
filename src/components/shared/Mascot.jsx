import React from 'react';
import './Mascot.css';

export function Mascot({ mood = 'happy', message = '', size = 'md' }) {
  return (
    <div className={`mascot-wrapper mascot-${size}`}>
      <div className="mascot-avatar">🧭</div>
      {message && <div className="mascot-bubble">{message}</div>}
    </div>
  );
}
export default Mascot;
