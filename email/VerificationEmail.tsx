import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  verifycode: string
}

export function VerificationEmail({ username, verifycode }: VerificationEmailProps) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Your verify code is </p>
    </div>
  );
}