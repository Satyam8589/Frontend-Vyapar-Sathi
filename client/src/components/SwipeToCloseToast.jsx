'use client';

import { useState, useRef } from 'react';
import toast, { ToastBar } from 'react-hot-toast';

/**
 * SwipeToCloseToast
 * A wrapper for react-hot-toast's ToastBar that adds swipe-to-close functionality.
 */
const SwipeToCloseToast = ({ t, children }) => {
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(null);
  const isDragging = useRef(false);

  const onPointerDown = (e) => {
    startX.current = e.clientX;
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current || startX.current === null) return;
    
    const deltaX = e.clientX - startX.current;
    
    // Only allow swiping to the right (common pattern for top-right toasts)
    // or both sides? Let's allow both but emphasize right for dismissal
    if (deltaX > 0) {
      setDragOffset(deltaX);
    } else {
      setDragOffset(deltaX * 0.2); // Resistance for left swipe
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // If swiped more than 80px to the right, dismiss
    if (dragOffset > 80) {
      toast.dismiss(t.id);
    } else {
      // Snap back
      setDragOffset(0);
    }
    
    startX.current = null;
  };

  const opacity = Math.max(1 - Math.abs(dragOffset) / 200, 0);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        transform: `translateX(${dragOffset}px)`,
        opacity: opacity,
        transition: isDragging.current ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        touchAction: 'none', // Prevent scrolling while swiping toast
      }}
    >
      <ToastBar toast={t}>
        {children}
      </ToastBar>
    </div>
  );
};

export default SwipeToCloseToast;
