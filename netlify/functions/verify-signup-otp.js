import crypto from 'node:crypto';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, otp, challengeToken } = JSON.parse(event.body || '{}');

    if (!email || !otp || !challengeToken) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Email, OTP, and challenge token are required' }),
      };
    }

    const parts = challengeToken.split('.');
    if (parts.length !== 3) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid challenge token format' }),
      };
    }

    const [expiresAtStr, nonce, expectedSignature] = parts;
    const expiresAt = Number(expiresAtStr);

    if (Date.now() > expiresAt) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Verification code has expired. Please request a new one.' }),
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOtp = otp.toString().trim();
    const otpSecret = process.env.OTP_SECRET || 'kc-secret-salt-2026';

    const payload = `signup:${normalizedEmail}:${normalizedOtp}:${expiresAtStr}:${nonce}`;
    const calculatedSignature = crypto.createHmac('sha256', otpSecret).update(payload).digest('hex');

    const signatureBuffer = Buffer.from(calculatedSignature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid verification code. Please check and try again.' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        verified: true,
        message: 'Email verified successfully',
      }),
    };
  } catch (error) {
    console.error('[verify-signup-otp]', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Internal server error during verification' }),
    };
  }
}
