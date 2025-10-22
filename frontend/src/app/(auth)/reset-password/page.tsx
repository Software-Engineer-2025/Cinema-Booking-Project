import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import BlackButton from "@/components/ui/BlackButton";

import Link from "next/link";

export default function ResetPassword() {
  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        
        <h2 className="">Reset Your Password</h2>
        <p>Enter a new secure password for your account.</p>
        <form className="flex flex-col gap-3">
          <AuthInput type="email" placeholder="Enter a secure password." className="pb-7" required />
          
       

          <BlackButton className="mb-6">Reset Password</BlackButton>
     
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
