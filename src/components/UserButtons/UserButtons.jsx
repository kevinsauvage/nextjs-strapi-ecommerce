import { useContext } from 'react';
import {
  RiShoppingCart2Line,
  RiUserLine,
  RiSearchLine,
  RiHeartsLine,
} from 'react-icons/ri';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import HeaderButton from '../HeaderButton/HeaderButton';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, toggleCart, toggleUser } =
    useContext(GlobalStoreContext);

  const data = [
    {
      item: <RiSearchLine />,
      id: 1,
      onClick: toggleSearch,
    },
    {
      item: <RiHeartsLine />,
      id: 2,
      onClick: toggleUser,
    },

    {
      item: <RiUserLine />,
      id: 3,
      onClick: toggleUser,
    },
    {
      item: <RiShoppingCart2Line />,
      id: 4,
      onClick: toggleCart,
    },
  ];

  return (
    <div className={styles.container}>
      <LanguageSwitcher />
      {data.map((el) => (
        <HeaderButton
          type="button"
          key={el.id}
          handleClick={() => el.onClick()}
        >
          {el.item}
        </HeaderButton>
      ))}
    </div>
  );
}
