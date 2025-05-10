import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/apiResponse";

// const resend = new Resend("");

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Anonimo Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    // console.log("result response", result);
    return {
      success: true,
      message: "Verification code sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification code",
    };
  }
}
