import Option from './Option/Option';

const Options = ({ options, isOptionOutOfStock, isSelected, handleClick, styles }) => {
  return Array.isArray(options) ? (
    <div className={styles}>
      {options.map((option) => (
        <Option
          key={option.id}
          option={option}
          isOptionOutOfStock={isOptionOutOfStock}
          isSelected={isSelected}
          handleClick={(value, name) => {
            handleClick({
              name,
              value,
            });
          }}
        />
      ))}
    </div>
  ) : null;
};

export default Options;
