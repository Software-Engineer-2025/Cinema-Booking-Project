import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";
import { useAuth } from "@/lib/context/AuthContext";
import {ChangeEvent, useState} from "react";
import { emailRegex } from "@/lib/utils/regex";

import Link from "next/link";

export default function ForgotPassword() {
   const { forgotPassword } = useAuth();
   const [email, setEmail] = useState<string>("");

   /*
    * Handles the input for the forgot password form submission.
    *
    * Could add a better alert and could make it so that when the email changes,
    * if its not valid, it shows a mini red alert under the box?
    */
   const handleForgotPassword = async (e: React.FormEvent) => {
       e.preventDefault();

       if (!emailRegex.test(email)) {
           alert("Please insert valid email before submitting!");
       } else {
           const result = await forgotPassword(email);
       }
   }

  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        <h2 className="">Forgot your password?</h2>
        <p>Enter the email address for the associated account.</p>
        <form className="flex flex-col gap-3">
          <AuthInput
              type="email"
              placeholder="example@example.com"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="pb-7"
              required/>
          <BlackButton className="mb-6" onClick={handleForgotPassword}>Request Reset Password</BlackButton>
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
