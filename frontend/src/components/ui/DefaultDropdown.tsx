"use client";
import {
  useState,
  ReactNode,
  isValidElement,
  cloneElement,
  Children,
} from "react";

export default function DefaultDropdown({
  label = "Select",
  children,
  className = "",
  onSelect,
}: {
  label?: string;
  children?: ReactNode;
  className?: string;
  onSelect?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string, child: ReactNode) => {
    setSelected(value);
    setOpen(false);
    if (onSelect) onSelect(value);
  };

  return (
    <div
      className={`relative inline-block text-left font-special font-bold ${className}`}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex w-full justify-between items-center gap-2 px-6 py-3 text-lg text-black bg-white/30 border-b border-white rounded-md hover:bg-white/60 uppercase focus:outline-none"
      >
        <span>{selected ?? label}</span>
        <svg
          width="30"
          height="30"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute left-0 mt-2 w-full bg-gray-200 text-black font-special rounded-md shadow-lg z-50
                     max-h-60 overflow-y-auto"
        >
          <div className="flex flex-col">
            {Children.map(children, (child, idx) => {
              if (!isValidElement(child)) return child;

              const value =
                typeof child.props.children === "string"
                  ? child.props.children
                  : `Option ${idx + 1}`;

              return cloneElement(child, {
                key: child.key || idx,
                onClick: (e: any) => {
                  if (child.props.onClick) child.props.onClick(e);
                  handleSelect(value, child);
                },
                className: `
                  block w-full px-4 py-2 text-left cursor-pointer
                  hover:bg-gray-100 hover:text-gray-500 hover:rounded-md
                  ${
                    idx !== Children.count(children) - 1
                      ? "border-b border-dotted border-black"
                      : ""
                  }
                  ${child.props.className || ""}
                `,
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
}
