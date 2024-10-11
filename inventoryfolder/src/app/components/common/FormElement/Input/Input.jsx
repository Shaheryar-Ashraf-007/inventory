// app/components/common/FormElements/Input/Input.js
import React from 'react';
import { Bell } from 'lucide-react';

const Input = ({ type = 'text', placeholder, value, onChange, className }) => {
  return (
    <div className="relative">
      <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
      />
    </div>
  );
};

export default Input;