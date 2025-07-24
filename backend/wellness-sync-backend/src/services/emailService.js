import nodemailer from 'nodemailer';

// Create transporter (using Gmail in this example)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendEmail = async (to, subject, html, text = null) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Would send:', { to, subject });
      return { success: true, message: 'Email service not configured (development mode)' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Wellness Sync" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Welcome to Wellness Sync!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Welcome to Wellness Sync!</h1>
      <p>Hi ${userName},</p>
      <p>Thank you for joining Wellness Sync! We're excited to help you on your wellness journey.</p>
      <p>With Wellness Sync, you can:</p>
      <ul>
        <li>Track your daily habits</li>
        <li>Monitor your mood</li>
        <li>Keep a personal journal</li>
        <li>View analytics and insights</li>
      </ul>
      <p>Get started by logging your first habit or mood entry!</p>
      <p>Best regards,<br>The Wellness Sync Team</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, html);
};

export const sendHabitReminderEmail = async (userEmail, userName, habits) => {
  const subject = 'Daily Habit Reminder - Wellness Sync';
  const incompleteHabits = habits.filter(h => h.completed < h.target);
  
  if (incompleteHabits.length === 0) {
    return { success: true, message: 'No incomplete habits to remind about' };
  }

  const habitsList = incompleteHabits
    .map(habit => `<li>${habit.icon} ${habit.name} (${habit.completed}/${habit.target} ${habit.unit})</li>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Daily Habit Reminder</h1>
      <p>Hi ${userName},</p>
      <p>Don't forget to complete your daily habits:</p>
      <ul style="background: #f8fafc; padding: 20px; border-radius: 8px;">
        ${habitsList}
      </ul>
      <p>You're doing great! Keep up the momentum! 💪</p>
      <p>Best regards,<br>The Wellness Sync Team</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, html);
};

export const sendMoodCheckInEmail = async (userEmail, userName) => {
  const subject = 'How are you feeling today? - Wellness Sync';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981;">How are you feeling today?</h1>
      <p>Hi ${userName},</p>
      <p>Take a moment to check in with yourself and log your mood in Wellness Sync.</p>
      <p>Remember, tracking your mood helps you:</p>
      <ul>
        <li>Identify patterns in your emotional well-being</li>
        <li>Understand what affects your mood</li>
        <li>Make better decisions for your mental health</li>
      </ul>
      <p>Every feeling is valid, and tracking them is a step towards better self-awareness.</p>
      <p>Take care,<br>The Wellness Sync Team</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, html);
};