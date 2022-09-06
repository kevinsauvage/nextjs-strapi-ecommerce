import { Children, useRef, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import useOnClickOutside from '@/hooks/useClickOutside';
import styles from './Dropdown.module.scss';

export default function Dropdown({
  selected,
  children,
  handleClick,
  optionClass,
  containerClass,
  indexSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const DropdownRef = useRef();

  useOnClickOutside(DropdownRef, () => isOpen && setIsOpen(false));

  const handleClickItem = (i) => {
    handleClick(i);
    setIsOpen((prev) => !prev);
  };

  const renderChildren = () =>
    Children.map(children, (child, i) => (
      <li
        role="option"
        aria-selected={i === indexSelected}
        tabIndex={0}
        className={`${styles.option} ${optionClass || ''}`}
        key={child}
        onClick={() => handleClickItem(i)}
        onKeyDown={(e) => e.key === 'Enter' && handleClickItem(i)}
      >
        {child}
      </li>
    ));

  return (
    <div
      className={`${styles.container} ${containerClass || ''}`}
      ref={DropdownRef}
    >
      <button
        type="button"
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className={styles.selected}>{selected}</p>
        <MdKeyboardArrowDown />
      </button>
      {isOpen && (
        <ul tabIndex={-1} className={styles.select} defaultValue={selected}>
          {renderChildren()}
        </ul>
      )}
    </div>
  );
}
