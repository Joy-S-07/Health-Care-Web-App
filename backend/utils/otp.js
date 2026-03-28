const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// In-memory OTP store: { email: { otp, expiresAt, verified } }
const otpStore = new Map();

// OTP validity duration (5 minutes)
const OTP_TTL = 5 * 60 * 1000;

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create the Nodemailer transporter using Google OAuth2
 */
async function createTransporter() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  return transporter;
}

/**
 * Send OTP to the given email address
 * @param {string} email - recipient
 * @param {string} purpose - 'signup' | 'login' | 'forgot-password'
 * @returns {Promise<string>} - the generated OTP (for logging/debug only)
 */
async function sendOTP(email, purpose = 'signup') {
  const otp = generateOTP();
  const expiresAt = Date.now() + OTP_TTL;

  // Store OTP
  otpStore.set(email.toLowerCase(), { otp, expiresAt, verified: false });

  const subjectMap = {
    'signup': 'MedAI - Verify Your Email',
    'login': 'MedAI - Sign In Verification',
    'forgot-password': 'MedAI - Password Reset OTP',
  };

  const bodyMap = {
    'signup': `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome to MedAI! 🏥</h2>
        <p style="color: #64748b; font-size: 15px;">Use the code below to verify your email address:</p>
        <div style="background: #0f172a; color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 12px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
    'login': `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Sign In to MedAI 🔑</h2>
        <p style="color: #64748b; font-size: 15px;">Use the code below to sign in:</p>
        <div style="background: #0f172a; color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 12px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
    'forgot-password': `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Password Reset 🔐</h2>
        <p style="color: #64748b; font-size: 15px;">Use the code below to reset your password:</p>
        <div style="background: #0f172a; color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 12px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  const transporter = await createTransporter();

  await transporter.sendMail({
    from: `"MedAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjectMap[purpose] || 'MedAI - Your OTP Code',
    html: bodyMap[purpose] || bodyMap['signup'],
  });

  // Auto-cleanup after TTL
  setTimeout(() => {
    const stored = otpStore.get(email.toLowerCase());
    if (stored && stored.otp === otp) {
      otpStore.delete(email.toLowerCase());
    }
  }, OTP_TTL + 1000);

  return otp;
}

/**
 * Verify the OTP for a given email
 * @param {string} email
 * @param {string} otp
 * @returns {{ valid: boolean, message: string }}
 */
function verifyOTP(email, otp) {
  const stored = otpStore.get(email.toLowerCase());

  if (!stored) {
    return { valid: false, message: 'No OTP found. Please request a new one.' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (stored.otp !== otp) {
    return { valid: false, message: 'Invalid OTP. Please try again.' };
  }

  // Mark as verified
  stored.verified = true;
  otpStore.set(email.toLowerCase(), stored);

  return { valid: true, message: 'OTP verified successfully.' };
}

/**
 * Check if an email has been OTP-verified
 */
function isEmailVerified(email) {
  const stored = otpStore.get(email.toLowerCase());
  return stored && stored.verified && Date.now() <= stored.expiresAt;
}

/**
 * Clear OTP record after successful registration/reset
 */
function clearOTP(email) {
  otpStore.delete(email.toLowerCase());
}

module.exports = { sendOTP, verifyOTP, isEmailVerified, clearOTP };
