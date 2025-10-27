import AuthCard from "@/components/auth/AuthCard";
// import AuthInput from "@/components/auth/AuthInput";
// import BlackButton from "@/components/ui/BlackButton";

import Link from "next/link";

export default function ResetPassword() {
  return (
    <div className="flex justify-center items-center">
      <AuthCard className="flex justify-center flex-col gap-6">
        
        <h2 className="">Account Created Successfully</h2>
        <p>Check your registered email for a link to verify your account and complete registration.</p>
        <form className="flex flex-col gap-3">
          
       

     
             <Link
            href="/login"
            className="underline text-left text-sm cursor-pointer"
          >
            Return to Login Page
          </Link>
        </form>
      </AuthCard>
    </div>
  );
}
