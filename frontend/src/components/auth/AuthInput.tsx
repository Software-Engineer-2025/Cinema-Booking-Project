interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode; // optional icon
  className?: string;
  header?: string; // optional header
}

export default function AuthInput({ icon, header, className, ...props }: AuthInputProps) {
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {/* Optional header above input */}
      {header && (
        <label className="text-white mb-1 font-medium">
          {header}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {/* Optional icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full
            rounded-lg
            py-3
            ${icon ? "pl-10" : "pl-3"}  /* dynamic left padding */
            pr-3
            bg-gray-300
            text-gray-600
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-gray-400
          `}
        />
      </div>
    </div>
  );
}
