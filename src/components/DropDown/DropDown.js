import { useRef, useState } from 'react';
import { arrowDown } from '@/assets/svg';
import useOnClickOutside from '@/hooks/useClickOutside';
import styles from './DropDown.module.scss';

function Dropdown({ options, changeCallback, selected }) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selected || options[0]);
  const containerRef = useRef();

  useOnClickOutside(containerRef, () => setOpen(false));

  const toggleOpen = () => setOpen(!open);

  const handleOptionSelect = (option) => () => {
    setSelectedOption(option);
    changeCallback(option.label);
    toggleOpen();
  };

  return (
    <div className={styles.DropDown} ref={containerRef}>
      <button
        type="button"
        className={styles.button}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="dropdown-menu"
      >
        {selectedOption.name}
        {arrowDown}
      </button>
      {open && (
        <ul
          className={styles.menu}
          id="dropdown-menu"
          role="listbox"
          aria-labelledby="dropdown-button"
        >
          {options
            .filter((item) => item.label !== selectedOption.label)
            .map((option, index) => (
              <li
                className={styles.option}
                key={option.label}
                onClick={handleOptionSelect(option)}
                onKeyDown={handleOptionSelect(option)}
                role="option"
                aria-selected={option.label === selectedOption.label}
                tabIndex={index}
              >
                <p>{option.name}</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
