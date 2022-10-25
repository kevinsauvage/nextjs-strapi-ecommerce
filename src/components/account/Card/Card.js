import style from './Card.module.scss';

export default function Card({ children, title }) {
  return (
    <div className={style.Card}>
      {title && <h5 className={style.title}>{title}</h5>}
      {children}
    </div>
  );
}
