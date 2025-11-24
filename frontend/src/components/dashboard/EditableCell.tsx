import { useState } from "react";

interface EditableCellProps {
  value,
  onChange,
  isEditable?: boolean
}

export default function EditableCell({value, onChange, isEditable = true}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value ?? "");

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  };

  return (
    <td
      className="p-3 border-b bg-white/10 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      {isEditing && isEditable ? (
        <input
          autoFocus
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      ) : (
        <span className="block truncate">{value?.toString() || "—"}</span>
      )}
    </td>
  );
}
