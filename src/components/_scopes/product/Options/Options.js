import Option from './Option/Option';

export default function Options({
  options,
  isOptionOutOfStock,
  isSelected,
  handleClick,
  styles,
}) {
  return (
    <div className={styles}>
      {Array.isArray(options) &&
        options.map((option) => (
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
  );
}
