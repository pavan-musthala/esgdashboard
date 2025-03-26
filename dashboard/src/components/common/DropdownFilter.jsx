import React from 'react';

const DropdownFilter = ({ options, value, onChange, label }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={label} className="mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
