import ActiveLink from '../ActiveLink/ActiveLink';
import Container from '../Container/Container';
import styles from './BigMenu.module.scss';

function BigMenu({ data, handleClose }) {
  const renderItems = (items) =>
    items.map((item) => (
      <div className={styles.container} key={item.id}>
        {item.items ? (
          <div className={styles.nested}>
            <h4 className={styles.title}>{item.title}</h4>
            {renderItems(item.items)}
          </div>
        ) : (
          <li key={item.id} className={styles.item}>
            <ActiveLink url={item.url}>{item.title}</ActiveLink>
          </li>
        )}
      </div>
    ));

  return (
    <div className={styles.bigMenu} role="button" tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
      <div
        className={styles.inner}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Container>
          <div className={styles.content}>{renderItems(data)}</div>
        </Container>
      </div>
    </div>
  );
}

export default BigMenu;
