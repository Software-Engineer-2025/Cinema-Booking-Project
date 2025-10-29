import React from "react";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function BlackButton({
  children,
  className = "",
  type = "submit",
  onClick,
  isDisabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6 py-4 font-body bg-black rounded-lg text-md font-bold opacity-90
        hover:text-gray hover:opacity-100 cursor-pointer
        transition-colors duration-200
        ${className}
      `}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}
