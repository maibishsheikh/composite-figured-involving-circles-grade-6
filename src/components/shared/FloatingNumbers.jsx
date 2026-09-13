import React from 'react';
import './FloatingNumbers.css';

export function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      <span className="fn fn-1">π</span>
      <span className="fn fn-2">r²</span>
      <span className="fn fn-3">2πr</span>
      <span className="fn fn-4">½</span>
      <span className="fn fn-5">¼</span>
      <span className="fn fn-6">⭕</span>
    </div>
  );
}
export default FloatingNumbers;
