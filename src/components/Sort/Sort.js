import React from 'react';

export default function Sort({ handleChange }) {
  const sortingOptions = [
    { label: 'RELEVANCE', name: 'Relevance' },
    { label: 'BEST_SELLING', name: 'Best selling' },
    { label: 'PRICE', name: 'Price Ascending' },
  ];

  return (
    <select selected={sortingOptions[0].label} onChange={handleChange}>
      {sortingOptions.map((option) => (
        <option key={option.name} value={option.label}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
