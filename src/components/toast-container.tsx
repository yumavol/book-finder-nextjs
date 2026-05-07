import { Slide, ToastContainer as ReactToastify } from 'react-toastify';
import { createPortal } from 'react-dom';
import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

export default function ToastContainer() {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return isClient ? <PortalToast /> : null;
}

const PortalToast = () =>
  createPortal(
    <ReactToastify
      position="bottom-right"
      theme="dark"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      transition={Slide}
      toastStyle={{
        padding: '0.8rem',
        fontFamily: 'var(--font-sans)',
        minHeight: '2rem',
        fontSize: '0.85rem',
      }}
      pauseOnHover
      aria-label="Toast notification"
      closeButton={CloseButton}
    />,
    document.getElementById('toast-root')!,
  );

const CloseButton = ({ closeToast }: any) => (
  <button
    onClick={closeToast}
    className="btn btn-square btn-ghost hover:text-white hover:bg-white/30 border-none btn-xs rounded-sm absolute top-0 right-0"
  >
    ✕
  </button>
);
