import { resend } from "@/lib/resend";
import { VerificationEmail } from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject:  'Mestry Message | Verification Code',
            react: VerificationEmail({ username: username,
                verifycode: verifycode,
             }),
        });

        return {
            success: true, message: "send verify email"
        }

    } catch (error) {
        console.error("Error send verification email", error)
        return {
            success: false, message: "Not send verify email"
        }
    }
}