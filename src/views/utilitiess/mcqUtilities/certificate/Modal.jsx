import styles from './modal.module.scss';

const Modal = ({ isOpen, handleClose, children }) => {
  return (
    <div className={`${styles.modalWrapper} ${isOpen ? styles.modalOpen : ''}`} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
