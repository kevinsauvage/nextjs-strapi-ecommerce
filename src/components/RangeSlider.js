import { useState } from 'react';

function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider({ min, max, onChange, id }) {
  const [value, setValue] = useState([min, max]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return <div>rage</div>;
}
