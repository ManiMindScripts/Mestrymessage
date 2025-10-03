import * as React from "react";

interface VerificationEmailProps {
  username: string;
  verifycode: string;
}

export function VerificationEmail({ username, verifycode }: VerificationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h1>Welcome, {username}!</h1>
      <p>
        Thank you for signing up. Please use the following verification code to
        complete your registration:
      </p>
      <div
        style={{
          background: "#f4f4f4",
          padding: "10px 20px",
          display: "inline-block",
          borderRadius: "6px",
          fontSize: "18px",
          fontWeight: "bold",
          letterSpacing: "2px",
        }}
      >
        {verifycode}
      </div>
      <p style={{ marginTop: "20px" }}>
        This code will expire in <b>1 hour</b>. If you didn’t create this
        account, you can safely ignore this email.
      </p>
    </div>
  );
}
