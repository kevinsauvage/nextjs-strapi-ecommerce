import style from './Card.module.scss';

export default function Card({ children, title, first }) {
  return (
    <div className={style.Card} style={{ order: first ? '1' : 2 }}>
      {title && <h5 className={style.title}>{title}</h5>}
      {children}
    </div>
  );
}
