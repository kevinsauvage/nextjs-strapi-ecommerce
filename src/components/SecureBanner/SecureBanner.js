import {
  MdOutlineDeliveryDining,
  MdOutlineHeadsetMic,
  MdOutlinePayments,
} from 'react-icons/md';
import styles from './SecureBanner.module.scss';

export default function SecureBanner() {
  const items = [
    {
      text: 'Free shipping all order over $99',
      icon: <MdOutlineDeliveryDining />,
    },
    {
      text: '100% secure payment',
      icon: <MdOutlinePayments />,
    },
    {
      text: '30 days money back',
      icon: <MdOutlineHeadsetMic />,
    },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div key={item.text} className={styles.item}>
          {item.icon}
          {item.text}
        </div>
      ))}
    </div>
  );
}
