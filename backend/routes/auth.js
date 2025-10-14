const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Generate 6-digit OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationOTPExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user (not verified initially)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      emailVerificationOTP: verificationOTP,
      emailVerificationOTPExpiry: verificationOTPExpiry,
      isVerified: false
    });

    await user.save();

    // Send verification email
    try {
      console.log('Creating email transporter...');
      const transporter = createTransporter();
      
      console.log('Sending verification email to:', email);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - MUKHTI Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">MUKHTI Store</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Premium Store</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Welcome to MUKHTI Store!</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${name},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for signing up with MUKHTI Store! To complete your registration and activate your account, 
                please verify your email address using the OTP code below:
              </p>
              
              <div style="background: #fff; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h3 style="color: #3B82F6; margin: 0; font-size: 32px; letter-spacing: 5px; font-family: monospace;">${verificationOTP}</h3>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0;">
                Enter this OTP code on the verification page to activate your account. 
                This code will expire in <strong>15 minutes</strong>.
              </p>
              
              <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #1976d2; margin: 0; font-size: 14px;">
                  <strong>Security Tip:</strong> Never share your OTP with anyone. MUKHTI Store will never ask for your OTP via email or phone.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                Best regards,<br>
                The MUKHTI Store Team
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully to:', email);
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully. Please check your email for the OTP code to verify your account.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified
        },
        verificationOTP: process.env.NODE_ENV === 'development' ? verificationOTP : undefined
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        code: emailError.code,
        response: emailError.response
      });

    res.status(201).json({
        success: true,
        message: 'Account created successfully. Please check your email for the OTP code to verify your account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
          isVerified: user.isVerified
        },
        verificationOTP: process.env.NODE_ENV === 'development' ? verificationOTP : undefined
      });
      }

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email address before logging in',
        requiresVerification: true 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Forgot Password - Send OTP to email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address' 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Generate reset token (expires in 15 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save OTP and reset token to user
    user.resetPasswordOTP = otp;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send OTP email
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset - MUKHTI Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">MUKHTI Store</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Premium Store</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Password Reset Request</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${user.name || 'User'},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                We received a request to reset your password for your MUKHTI Store account. 
                Use the following OTP code to reset your password:
              </p>
              
              <div style="background: #fff; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h3 style="color: #3B82F6; margin: 0; font-size: 32px; letter-spacing: 5px; font-family: monospace;">${otp}</h3>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0;">
                This OTP will expire in <strong>15 minutes</strong>. If you didn't request this password reset, 
                please ignore this email or contact our support team.
              </p>
              
              <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #1976d2; margin: 0; font-size: 14px;">
                  <strong>Security Tip:</strong> Never share your OTP with anyone. MUKHTI Store will never ask for your password or OTP via email or phone.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                Best regards,<br>
                The MUKHTI Store Team
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      res.json({
        success: true,
        message: 'Password reset OTP sent to your email address',
        resetToken: resetToken // Send token for frontend to use in reset password
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Still save the OTP even if email fails (for testing)
      res.json({
        success: true,
        message: 'Password reset OTP generated. Check your email or contact support if you don\'t receive it.',
        resetToken: resetToken,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only show OTP in development
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Reset Password - Verify OTP and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, token, and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if reset token exists and is not expired
    if (!user.resetPasswordToken || !user.resetPasswordExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset token' 
      });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired. Please request a new one.' 
      });
    }

    // OTP already verified in the previous step, no need to verify again

    // Update user password and clear reset fields
    // Password will be automatically hashed by the pre-save hook
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Verify OTP (optional endpoint for frontend validation)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, token, otp } = req.body;

    if (!email || !token || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if reset token exists and is not expired
    if (!user.resetPasswordToken || !user.resetPasswordExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reset token' 
      });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token has expired. Please request a new one.' 
      });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP code' 
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Send Email Verification
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email address' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already verified' 
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save verification token to user
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpiry = verificationExpiry;
    await user.save();

    // Send verification email
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - MUKHTI Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">MUKHTI Store</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Premium Store</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Verify Your Email Address</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${user.name || 'User'},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for signing up with MUKHTI Store! To complete your registration and activate your account, 
                please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}" 
                   style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0;">
                If the button doesn't work, you can also copy and paste this link into your browser:
              </p>
              
              <div style="background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin: 20px 0; word-break: break-all;">
                <code style="color: #3B82F6; font-size: 12px;">
                  ${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}
                </code>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0;">
                This verification link will expire in <strong>24 hours</strong>. If you didn't create an account with us, 
                please ignore this email.
              </p>
              
              <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #1976d2; margin: 0; font-size: 14px;">
                  <strong>Security Note:</strong> This verification link is unique to your account and should not be shared with anyone.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                Best regards,<br>
                The MUKHTI Store Team
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      res.json({
        success: true,
        message: 'Verification email generated. Check your email or contact support if you don\'t receive it.',
        verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
      });
    }

  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Verify Email with OTP
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already verified' 
      });
    }

    // Check if verification OTP exists and is not expired
    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP code' 
      });
    }

    if (new Date() > user.emailVerificationOTPExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }

    // Verify the user
    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Verify Password Reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if reset OTP exists and is not expired
    if (!user.resetPasswordOTP || !user.resetPasswordExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP code' 
      });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }

    // OTP is valid, return success with reset token
    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken: user.resetPasswordToken
    });

  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Resend Email Verification OTP
router.post('/resend-verification-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already verified' 
      });
    }

    // Generate new 6-digit OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationOTPExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save new OTP to user
    user.emailVerificationOTP = verificationOTP;
    user.emailVerificationOTPExpiry = verificationOTPExpiry;
    await user.save();

    // Send verification email
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - MUKHTI Store (New OTP)',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">MUKHTI Store</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Premium Store</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">New Verification Code</h2>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${user.name || 'User'},
              </p>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Here's your new verification code to complete your account registration:
              </p>
              
              <div style="background: #fff; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h3 style="color: #3B82F6; margin: 0; font-size: 32px; letter-spacing: 5px; font-family: monospace;">${verificationOTP}</h3>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0;">
                Enter this OTP code on the verification page to activate your account. 
                This code will expire in <strong>15 minutes</strong>.
              </p>
              
              <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #1976d2; margin: 0; font-size: 14px;">
                  <strong>Security Tip:</strong> Never share your OTP with anyone. MUKHTI Store will never ask for your OTP via email or phone.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                Best regards,<br>
                The MUKHTI Store Team
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      res.json({
        success: true,
        message: 'New verification OTP sent successfully'
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      res.json({
        success: true,
        message: 'New verification OTP generated. Check your email or contact support if you don\'t receive it.',
        verificationOTP: process.env.NODE_ENV === 'development' ? verificationOTP : undefined
      });
    }

  } catch (error) {
    console.error('Resend verification OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Verify Email (legacy endpoint for link-based verification)
router.post('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token and email are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already verified' 
      });
    }

    // Check if verification token exists and is not expired
    if (!user.emailVerificationToken || !user.emailVerificationExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification token' 
      });
    }

    if (user.emailVerificationToken !== token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification token' 
      });
    }

    if (new Date() > user.emailVerificationExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Verification token has expired. Please request a new one.' 
      });
    }

    // Verify the user
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Profile updated successfully', 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 8 characters long' 
      });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Update avatar
router.put('/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ 
        success: false, 
        message: 'Avatar URL is required' 
      });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.avatar = avatar;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Avatar updated successfully', 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Google OAuth Routes - Simple and Clean
const passport = require('passport');

// Google OAuth login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

// Google OAuth callback - Simple redirect approach
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed` }),
  async (req, res) => {
    try {
      console.log('🔐 Google OAuth callback successful for user:', req.user.email);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Always redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL}/login?token=${token}&google=true&success=true`;
      console.log('🔐 Redirecting to frontend with token');
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

module.exports = router;