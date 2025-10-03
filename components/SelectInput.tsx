
import React from 'react';
import type { Option } from '../types';

interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option<T>[];
  name: string;
}

const SelectInput = <T extends string,>({ label, value, onChange, options, name }: SelectInputProps<T>) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
