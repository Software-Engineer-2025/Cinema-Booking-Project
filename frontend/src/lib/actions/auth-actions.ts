'use server'

import { createClient } from "@/lib/supabase/server";
import { CreateUserParams} from "@/lib/context/AuthContext";
import { revalidatePath } from "next/cache";
import { phoneRegex, emailRegex } from "@/lib/utils/regex";

/*
    Signs up the user and adds them to the Supabase auth.users table.
 */
export async function signUpAction(userData: CreateUserParams) {
    try {
        const supabase = await createClient();

        if (userData.password !== userData.repeatPassword) {
            return { error: "Passwords don't match." };
        }

        /*
        if (!phoneRegex.test(userData.phoneNumber)) {
            return { error: "Phone number is not formatted in any valid way." };
        } else {
            userData.phoneNumber = userData.phoneNumber.replace(/\D/g, '');
        }
         */

        // Build options object and include user metadata (options.data) when present.
        const signUpOptions: any = {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email`
        };

        // Prefer an explicit options.data bag if provided by the caller (keeps flexibility).
        if (userData.options && userData.options.data) {
            signUpOptions.data = userData.options.data;
        } else {
            // Fallback: include commonly provided metadata fields if present.
            const meta: Record<string, any> = {};
            if ((userData as any).first_name) meta.first_name = (userData as any).first_name;
            if ((userData as any).last_name) meta.last_name = (userData as any).last_name;
            if ((userData as any).phone) meta.phone = (userData as any).phone;
            if ((userData as any).address_line_1) meta.address_line_1 = (userData as any).address_line_1;
            if ((userData as any).address_line_2) meta.address_line_2 = (userData as any).address_line_2;
            if ((userData as any).city) meta.city = (userData as any).city;
            if ((userData as any).state) meta.state = (userData as any).state;
            if ((userData as any).zip) meta.zip = (userData as any).zip;
            if ((userData as any).country) meta.country = (userData as any).country;
            if (Object.keys(meta).length > 0) signUpOptions.data = meta;
        }

        const result = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: signUpOptions,
        });


        revalidatePath('create-account', 'layout');

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * Logs in the user and creates a session for the user
 */
export async function logInAction(email: string, password: string) {
    try {
        const supabase = await createClient();

        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        revalidatePath('/login', 'layout');

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * Sends the reset password email.
 */
export async function forgotPasswordAction(email: string) {
    if (!emailRegex.test(email)) {
        return { error: "Phone number is not formatted in any valid way." };
    }

    try {
        const supabase = await createClient();

        const result = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'auth/reset-password',
        });

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * Updates the user's password based on the given password.
 */
export async function updatePasswordAction(password: string) {
    try {
        const supabase = await createClient();

        const result = await supabase.auth.updateUser({password: password});

        return result.error ? result.error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * checks the server side user session.
 */
export async function checkUserAction() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user) {
            console.log("here is the user", user);
        } else {
            console.log("no user session in server side");
        }
        return error ? error : null;
    } catch (unexpectedError) {
        return unexpectedError;
    }
}

/*
 * checks if the user is verified
 */
export async function checkVerificationAction() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error.message);
        return null;
    }

    if (user) {
        //console.log("user confirmed?: " + user.email_confirmed_at)
        return !!user.email_confirmed_at;
    } else {
        console.log('no user session in server side');
        return null;
    }
}
