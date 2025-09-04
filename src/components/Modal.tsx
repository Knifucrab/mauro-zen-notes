import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="p-8 rounded shadow-lg min-w-[320px] max-w-[90vw] relative"
        style={{ backgroundColor: '#DDDCC8', color: 'black' }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-2xl font-bold px-2"
          aria-label="Close modal"
          style={{ background: 'none', border: 'none' }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
