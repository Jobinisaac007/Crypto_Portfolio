import React from "react";

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  rightElement = null,
  keyboardType = "default",
}) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-sky-500">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          inputMode={keyboardType === "email" ? "email" : "text"}
          className="flex-1 outline-none text-sm"
        />
        {rightElement && <div className="ml-3">{rightElement}</div>}
      </div>
    </div>
  );
}