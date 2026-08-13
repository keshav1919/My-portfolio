import crypto from 'node:crypto';

/**
 * Privileged password update endpoint using Firebase Admin SDK.
 * Requires FIREBASE_SERVICE_ACCOUNT environment variable in Netlify.
 */
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, newPassword, resetToken } = JSON.parse(event.body || '{}');

    if (!email || !newPassword || !resetToken) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Missing required parameters' }),
      };
    }

    if (newPassword.length < 6) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }),
      };
    }

    // Verify resetToken
    const parts = resetToken.split('.');
    if (parts.length !== 3) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid reset authorization token' }),
      };
    }

    const [resetExpiresStr, resetNonce, expectedTicket] = parts;
    if (Date.now() > Number(resetExpiresStr)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Reset session expired. Please restart recovery.' }),
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpSecret = process.env.OTP_SECRET || 'kc-secret-salt-2026';
    const computedTicket = crypto.createHmac('sha256', otpSecret)
      .update(`ticket:${normalizedEmail}:${resetExpiresStr}:${resetNonce}`)
      .digest('hex');

    if (computedTicket !== expectedTicket) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Unauthorized reset request' }),
      };
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
      console.warn('[KeshavCoder Auth] FIREBASE_SERVICE_ACCOUNT not configured for direct Admin SDK password mutation.');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Password reset verified. (To complete server-side auth password change, configure FIREBASE_SERVICE_ACCOUNT)',
        }),
      };
    }

    // If Firebase Admin credentials are provided in Netlify environment variables:
    // Dynamically require/import firebase-admin to keep cold starts lean
    const admin = await import('firebase-admin');
    if (!admin.default.apps.length) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.default.initializeApp({
        credential: admin.default.credential.cert(serviceAccount),
      });
    }

    const auth = admin.default.auth();
    const userRecord = await auth.getUserByEmail(normalizedEmail);
    await auth.updateUser(userRecord.uid, {
      password: newPassword,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Password successfully updated',
      }),
    };
  } catch (error) {
    console.error('[reset-password-admin]', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message || 'Failed to update password' }),
    };
  }
}
