import type { HomePageData } from '@/app/page';
import Button from '@/components/Button/Button';

import style from './CollectionCard.module.scss';

const CollectionCard = ({
  collection,
}: {
  collection:
    | HomePageData['bigCardCollections'][number]
    | HomePageData['featuredCollections'][number];
}) => {
  const { title, image, handle } = collection || {};

  const backgroundStyle = { backgroundImage: `url(${image?.url})` };

  return (
    <div className={style.card} style={{ ...backgroundStyle }}>
      <div className={style.content}>
        <p className={style.title}>
          <span>{title} </span> COLLECTION
        </p>
        <Button contrast extraClass={style.link} href={handle}>
          <span>Shop now</span>
        </Button>
      </div>
    </div>
  );
};

export default CollectionCard;
