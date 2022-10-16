import Separator from '@/components/Separator/Separator';
import Option from './Option/Option';

export default function Options({
  options,
  isOptionOutOfStock,
  isSelected,
  handleClick,
}) {
  return (
    <div>
      {Array.isArray(options) && options.length > 1 && (
        <>
          <Separator />
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
          <Separator />
        </>
      )}
    </div>
  );
}
