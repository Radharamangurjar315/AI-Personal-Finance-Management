"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({ label, type = "text", value, onChange }: InputFieldProps) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-200 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
        placeholder={label}
        required
      />
    </div>
  );
}
