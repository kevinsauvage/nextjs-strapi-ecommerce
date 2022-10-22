import Separator from '@/components/Separator/Separator';
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
        options.map((option, i) => (
          <>
            {option.values?.length > 1 && i === 0 && (
              <Separator key={option.values[0].name} />
            )}
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
          </>
        ))}
    </div>
  );
}
