import * as React from 'react';

interface VerificationEmailProps {
  username: string;
}

export function VerificationEmail({ username }: VerificationEmailProps) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
    </div>
  );
}