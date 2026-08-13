/**
 * Map Firebase Auth error codes to helpful human-readable messages.
 */
export function formatAuthError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes before trying again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Netlify Function helper
 */
async function callNetlifyFunction(endpoint, body) {
  const url = `/.netlify/functions/${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`[Netlify Function Error: ${endpoint}]`, err);
    throw err;
  }
}

export async function sendSignupOtp(email, name) {
  return callNetlifyFunction('send-signup-otp', { email, name });
}

export async function verifySignupOtp(email, otp, challengeToken) {
  return callNetlifyFunction('verify-signup-otp', { email, otp, challengeToken });
}

export async function sendResetOtp(email) {
  return callNetlifyFunction('send-reset-otp', { email });
}

export async function verifyResetOtp(email, otp, challengeToken) {
  return callNetlifyFunction('verify-reset-otp', { email, otp, challengeToken });
}

export async function resetPasswordAdmin(email, newPassword, resetToken) {
  return callNetlifyFunction('reset-password-admin', { email, newPassword, resetToken });
}
