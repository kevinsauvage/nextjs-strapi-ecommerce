import CollectionCard from '../_scopes/collection/CollectionCard/CollectionCard';
import ActiveLink from '../ActiveLink/ActiveLink';
import Container from '../Container/Container';

import styles from './BigMenu.module.scss';

const BigMenu = ({ data, handleClose, collections }) => {
  const renderItems = (items) => (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.items ? (
            <>
              <h5 className={styles.title}>{item.title}</h5>
              {renderItems(item.items)}
            </>
          ) : (
            <ActiveLink url={item.url}>{item.title}</ActiveLink>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.bigMenu} role="button" tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
      <div
        className={styles.inner}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Container>
          <div className={styles.content}>
            <div className={styles.navigation}>{renderItems(data)}</div>
            <div className={styles.collections}>
              {collections?.map((collection) => (
                <li key={collection.title} className={styles.card}>
                  <CollectionCard collection={collection} />
                </li>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BigMenu;
