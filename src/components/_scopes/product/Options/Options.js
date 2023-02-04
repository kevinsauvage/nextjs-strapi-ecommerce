import Option from './Option/Option';

export default function Options({ options, isOptionOutOfStock, isSelected, handleClick, styles }) {
  console.log('🚀 ~ file: Options.js:5 ~ Options ~ options', options);

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
}
