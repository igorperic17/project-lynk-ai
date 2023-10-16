import React, { FC, useEffect, useState } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: any
}

const Modal: FC<ModalProps> = ({ show, onClose, children }) => {
  const [display, setDisplay] = useState(show);

  useEffect(() => {
    if (show) setDisplay(true);
  }, [show]);

  const handleClose = () => {
    setDisplay(false);
    onClose();
  };

  return (
    <>
      {display && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center">
          <div className="border min-w-[90%] sm:min-w-[500px] min-h-[300px] justify-center items-center flex-col border-blue-900 bg-blue-950/30 p-8 rounded-lg shadow-lg transition-transform transform duration-800 ease-in-out">
            {children}
            <button onClick={handleClose} className="mt-4 px-5 py-2 bg-green-500/30 border-green-800 border hover:bg-green-800 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
