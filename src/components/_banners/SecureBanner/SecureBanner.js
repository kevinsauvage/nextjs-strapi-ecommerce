import {
  MdOutlineDeliveryDining,
  MdOutlineLockOpen,
  MdOutlinePayments,
} from 'react-icons/md';
import { RiSecurePaymentLine } from 'react-icons/ri';
import Container from '@/components/Container/Container';
import styles from './SecureBanner.module.scss';

export default function SecureBanner() {
  const items = [
    {
      text: 'Free shipping',
      subtitle: 'Free shipping all order over $99',
      icon: <MdOutlineDeliveryDining />,
    },
    {
      text: 'Money guaranteed',
      subtitle: '30 days money back',
      icon: <MdOutlinePayments />,
    },
    {
      text: 'Safe Payment',
      subtitle: 'Secured payment protection',
      icon: <RiSecurePaymentLine />,
    },
    {
      text: '100% safe',
      subtitle: 'Secure shopping',
      icon: <MdOutlineLockOpen />,
    },
  ];

  return (
    <div className={styles.container}>
      <Container>
        {items.map((item) => (
          <div key={item.text} className={styles.item}>
            {item.icon}
            <div className={styles.content}>
              <p className={styles.text}>{item.text}</p>
              <p className={styles.subtitle}>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
