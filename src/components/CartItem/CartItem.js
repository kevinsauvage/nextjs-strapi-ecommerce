import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineDeleteForever } from 'react-icons/md';
import routes from '../../data/routes';
import styles from './CartItem.module.scss';

export default function CartItem({ product, quantity }) {
  console.log(product, quantity);
  return (
    <tr className={styles.container}>
      <td className={styles.item}>
        <ul className={styles.list}>
          <li className={styles.image}>
            <Link
              href={`${routes.base.shop}/${product?.variableValues?.handle}`}
            >
              <Image
                src={product.image.src}
                width={product.image.width}
                height={product.image.height}
                alt="Electronic equipment"
                layout="fill"
              />
            </Link>
          </li>
          <li className={styles.content}>
            <p>{product.title}</p>
          </li>
        </ul>
      </td>
      <td className={styles.item}>
        <span className={styles.price}>{product.price}</span>
      </td>
      <td className={styles.item}>
        <input type="text" size="4" value={quantity} className={styles.input} />
      </td>
      <td className={styles.item}>
        <span className={styles.price}>
          {Number(product.price) * Number(quantity)}
        </span>
      </td>
      <td className={styles.item}>
        <p>
          <MdOutlineDeleteForever />
        </p>
      </td>
    </tr>
  );
}
