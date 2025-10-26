import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import { passwordRegex } from "@/lib/utils/regex";

import Link from "next/link";
import {ChangeEvent, useState} from "react";
import { useAuth } from "@/lib/context/AuthContext";

export default function ResetPassword() {
    const { updatePassword } = useAuth();
    const [password, setPassword] = useState("");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordRegex.test(password)) {
            alert("Please insert valid password before submitting!\n" +
                "Must have 1 uppercase letter, 1 lower case letter, " +
                "1 special character, 1 number, and must be 8-12 characters long");
        } else {
            const result = await updatePassword(password);
        }
    }

  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        
        <h2 className="">Reset Your Password</h2>
        <p>Enter a new secure password for your account.</p>
        <form className="flex flex-col gap-3">
          <AuthInput
              type="email"
              placeholder="Enter a secure password."
              onChange={(e: ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
              className="pb-7"
              required />
          <BlackButton className="mb-6" onClick={handleResetPassword}>Reset Password</BlackButton>
             <Link
            href="/login"
            className="underline text-center text-sm cursor-pointer"
          >
            Return to Login Page
          </Link>
        </form>
      </AuthCard>
    </div>
  );
}
