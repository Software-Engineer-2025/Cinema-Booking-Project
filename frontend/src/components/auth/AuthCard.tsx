import React from "react"; 

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function AuthCard( { children, className }: AuthCardProps) {
    return (
        <div className={`bg-gradient-to-b from-gray-900 to-white/30 text-white rounded-2xl shadow-lg p-8 py-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] w-full max-w-lg ${className ?? ""}`}>
            {children}
        </div>
    );
}