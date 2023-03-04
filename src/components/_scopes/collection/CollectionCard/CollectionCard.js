import Link from 'next/link';

import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle, subtitle } = collection || {};

  const backgroundStyle = { backgroundImage: `url(${image.url})` };
  return (
    <div className={style.CollectionCard} style={{ ...backgroundStyle }} alt={image?.alt}>
      <div className={style.content}>
        <h3 className={style.title}>{title} COLLECTION</h3>
        {subtitle && <p className={style.subtitle}>{subtitle}</p>}
        <Link className={style.link} href={`${handle}`}>
          <span>Shop now</span>
        </Link>
      </div>
    </div>
  );
}
