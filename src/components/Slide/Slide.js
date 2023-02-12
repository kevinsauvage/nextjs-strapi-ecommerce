import styles from './Slide.module.scss';

function Slide({ isOpen, handleClose, content }) {
  return (
    <div className={`${isOpen && styles.open} ${styles.slide}`}>
      <div className={`${isOpen && styles.openInner} ${styles.inner}`}>
        <button type="button" onClick={handleClose}>
          close
        </button>
        {content}
      </div>
    </div>
  );
}

export default Slide;
