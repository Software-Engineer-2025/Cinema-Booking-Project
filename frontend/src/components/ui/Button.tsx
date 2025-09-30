import React from "react";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Button({ children, className = ""}: ButtonProps) {

  return (
    <button
      className={`
        px-6 py-2 font-special uppercase text-2xl opacity-60 
        hover:text-white hover:opacity-100 cursor-pointer 
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
}
