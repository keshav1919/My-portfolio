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
    const { email } = JSON.parse(event.body || '{}');

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Valid email address is required' }),
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const nonce = crypto.randomBytes(8).toString('hex');

    const otpSecret = process.env.OTP_SECRET || 'kc-secret-salt-2026';
    const payload = `reset:${normalizedEmail}:${otp}:${expiresAt}:${nonce}`;
    const signature = crypto.createHmac('sha256', otpSecret).update(payload).digest('hex');
    const challengeToken = `${expiresAt}.${nonce}.${signature}`;

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.log('\n==================================================');
      console.log(`  [KESHAVCODER RESET DEV OTP]`);
      console.log(`  Target Email: ${normalizedEmail}`);
      console.log(`  6-Digit OTP:  \x1b[32m\x1b[1m${otp}\x1b[0m`);
      console.log('==================================================\n');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          challengeToken,
          message: 'Password reset code generated (Dev mode: check terminal console for code)',
        }),
      };
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Reset KeshavCoder Password</title>
  <style type="text/css">
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background-color: #f5f5f7;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
      border-collapse: collapse !important;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 480px) {
      .email-card {
        width: 100% !important;
        border-radius: 12px !important;
      }
      .email-content {
        padding: 24px 16px !important;
      }
      .otp-code {
        font-size: 24px !important;
        letter-spacing: 3px !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f7; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="width:100%; max-width:100%; padding:20px 8px; box-sizing:border-box; background-color:#f5f5f7;">
    
    <!-- CARD CONTAINER -->
    <div class="email-card" style="width:100%; max-width:480px; margin:0 auto; background-color:#ffffff; border:1px solid #e7e7eb; border-radius:16px; overflow:hidden; box-sizing:border-box; box-shadow:0 4px 14px rgba(0,0,0,0.04);">
      
      <!-- HEADER -->
      <div style="padding:16px 20px; background-color:#000000; box-sizing:border-box;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:100%; table-layout:fixed; border-collapse:collapse;">
          <tr>
            <td style="width:40px; vertical-align:middle;">
              <img
                src="https://cdn.phototourl.com/free/2026-08-13-28121e43-073e-4c34-bb4a-a95190f98a59.png"
                width="34"
                height="34"
                alt="Keshav Coder"
                style="display:block; width:34px; height:34px; object-fit:contain; border:0; outline:none; text-decoration:none;"
              />
            </td>
            <td style="vertical-align:middle; padding-left:8px; color:#ffffff; font-size:17px; line-height:1.2; font-weight:700; letter-spacing:-0.2px;">
              Keshav Coder
            </td>
          </tr>
        </table>
      </div>

      <!-- CONTENT -->
      <div class="email-content" style="width:100%; padding:28px 22px; box-sizing:border-box;">
        
        <div style="margin:0 0 8px; color:#777681; font-size:10px; line-height:1.4; font-weight:700; letter-spacing:1.3px; text-transform:uppercase;">
          Password Reset
        </div>

        <h1 style="margin:0; padding:0; color:#18181d; font-size:22px; line-height:1.3; font-weight:700; letter-spacing:-0.4px;">
          Your recovery code
        </h1>

        <p style="margin:10px 0 0; padding:0; color:#72727c; font-size:14px; line-height:1.6;">
          Enter the code below to reset the password for <strong>${normalizedEmail}</strong>.
        </p>

        <!-- OTP BOX -->
        <div style="width:100%; margin:22px 0; padding:18px 8px; box-sizing:border-box; background-color:#f7f7fa; border:1px solid #e3e2e9; border-radius:9px; text-align:center; overflow:hidden;">
          <span class="otp-code" style="display:inline-block; max-width:100%; color:#18181d; font-family:'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size:28px; line-height:1; font-weight:700; letter-spacing:5px; padding-left:5px; white-space:nowrap; box-sizing:border-box;">
            ${otp}
          </span>
        </div>

        <p style="margin:0; padding:0; color:#74747d; font-size:12px; line-height:1.65;">
          If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
        </p>

        <div style="height:1px; margin:24px 0 17px; background-color:#eeeeF2;"></div>

        <!-- FOOTER ROW -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:100%; table-layout:fixed; border-collapse:collapse;">
          <tr>
            <td style="vertical-align:middle; color:#a0a0aa; font-size:11px; line-height:1.5; word-break:break-word;">
              Security recovery email
            </td>
            <td style="vertical-align:middle; text-align:right; font-size:11px; line-height:1.5; word-break:break-word;">
              <a
                href="https://keshavcoder.online/"
                target="_blank"
                rel="noreferrer"
                style="color:#673de6; text-decoration:none; font-weight:600;"
              >
                keshavcoder.online
              </a>
            </td>
          </tr>
        </table>

      </div>

    </div>

    <!-- BOTTOM COPYRIGHT -->
    <div style="width:100%; max-width:480px; margin:14px auto 0; text-align:center; box-sizing:border-box;">
      <p style="margin:0; padding:0; color:#a1a1aa; font-size:10px; line-height:1.6;">
        &copy; ${new Date().getFullYear()} Keshav &middot; Frontend Developer Platform
      </p>
    </div>

  </div>
</body>
</html>
`;

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Keshav Coder',
          email: 'otp@keshavcoder.online',
        },
        to: [{ email: normalizedEmail }],
        subject: 'Reset your KeshavCoder password',
        htmlContent,
      }),
    });

    if (!brevoResponse.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Failed to deliver reset code. Please try again.' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        challengeToken,
        message: 'Password reset code sent to your email',
      }),
    };
  } catch (error) {
    console.error('[send-reset-otp]', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Internal server error' }),
    };
  }
}
