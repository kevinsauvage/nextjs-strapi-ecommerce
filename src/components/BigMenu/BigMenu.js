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
    <div className={styles.bigMenu}>
      <div className={styles.inner}>
        <Container>
          <div className={styles.content}>{renderItems(data)}</div>
        </Container>
      </div>
      <div
        role="button"
        tabIndex="0"
        className={styles.bottom}
        onMouseOver={() => handleClose()}
        onFocus={() => handleClose()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClose()}
        aria-label="Close Menu"
      />
    </div>
  );
}

export default BigMenu;
