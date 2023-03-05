import Button from '@/components/Button/Button';

import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle, subtitle } = collection || {};

  const backgroundStyle = { backgroundImage: `url(${image.url})` };

  return (
    <div className={style.CollectionCard} style={{ ...backgroundStyle }} alt={image?.alt}>
      <div className={style.content}>
        <h4 className={style.title}>{title} COLLECTION</h4>
        {subtitle && <p className={style.subtitle}>{subtitle}</p>}
        <Button contrast extraClass={style.link} href={handle}>
          <span>Shop now</span>
        </Button>
      </div>
    </div>
  );
}
