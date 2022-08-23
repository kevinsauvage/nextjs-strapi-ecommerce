import { useContext } from 'react';
import {
  MdOutlineAccountCircle,
  MdOutlineSearch,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import HeaderButton from '../HeaderButton/HeaderButton';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, toggleCart, toggleUser } =
    useContext(GlobalStoreContext);

  const data = [
    {
      item: <MdOutlineSearch />,
      id: 1,
      onClick: toggleSearch,
    },

    {
      item: <MdOutlineAccountCircle />,
      id: 2,
      onClick: toggleUser,
    },
    {
      item: <MdOutlineShoppingCart />,
      id: 3,
      onClick: toggleCart,
    },
  ];

  return (
    <div className={styles.container}>
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
