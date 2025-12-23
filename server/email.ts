import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

interface FormSubmissionData {
  homeownerName: string;
  homeownerEmail: string;
  homeownerPhone?: string;
  message?: string;
  propertyAddress: string;
  propertyCity: string;
  propertyMarket?: string;
  projectionLow: number;
  projectionExpected: number;
  projectionHigh: number;
  projectionPageUrl: string;
  leadId?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function buildFormSubmissionEmail(data: FormSubmissionData): EmailPayload {
  const subject = `New Projection Page Form Submission - ${data.propertyAddress}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333333;">New Form Submission from Projection Page</h2>
      
      <div style="background-color: #f7f4f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333333; margin-top: 0;">Contact Information</h3>
        <p><strong>Name:</strong> ${data.homeownerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.homeownerEmail}">${data.homeownerEmail}</a></p>
        ${data.homeownerPhone ? `<p><strong>Phone:</strong> <a href="tel:${data.homeownerPhone}">${data.homeownerPhone}</a></p>` : ''}
        ${data.leadId ? `<p><strong>Salesforce Lead ID:</strong> ${data.leadId}</p>` : ''}
      </div>
      
      <div style="background-color: #f7f4f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333333; margin-top: 0;">Property Details</h3>
        <p><strong>Address:</strong> ${data.propertyAddress}</p>
        <p><strong>Market:</strong> ${data.propertyCity}${data.propertyMarket ? `, ${data.propertyMarket}` : ''}</p>
      </div>
      
      <div style="background-color: #f7f4f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333333; margin-top: 0;">Revenue Projection</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Conservative:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(data.projectionLow)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Expected:</strong></td>
            <td style="padding: 8px 0; text-align: right; color: #2e7d32; font-weight: bold;">${formatCurrency(data.projectionExpected)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Optimistic:</strong></td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(data.projectionHigh)}</td>
          </tr>
        </table>
      </div>
      
      ${data.message ? `
      <div style="background-color: #f7f4f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333333; margin-top: 0;">Message from Homeowner</h3>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="${data.projectionPageUrl}" style="display: inline-block; background-color: #d3bda2; color: #333333; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">View Projection Page</a>
      </div>
      
      <p style="margin-top: 30px; font-size: 12px; color: #666666; text-align: center;">
        This email was sent from the LocalVR Revenue Projections system.
      </p>
    </div>
  `;
  
  const text = `
New Form Submission from Projection Page

Contact Information:
- Name: ${data.homeownerName}
- Email: ${data.homeownerEmail}
${data.homeownerPhone ? `- Phone: ${data.homeownerPhone}` : ''}
${data.leadId ? `- Salesforce Lead ID: ${data.leadId}` : ''}

Property Details:
- Address: ${data.propertyAddress}
- Market: ${data.propertyCity}${data.propertyMarket ? `, ${data.propertyMarket}` : ''}

Revenue Projection:
- Conservative: ${formatCurrency(data.projectionLow)}
- Expected: ${formatCurrency(data.projectionExpected)}
- Optimistic: ${formatCurrency(data.projectionHigh)}

${data.message ? `Message from Homeowner:\n${data.message}` : ''}

View Projection Page: ${data.projectionPageUrl}
  `.trim();
  
  return {
    to: '',
    subject,
    html,
    text
  };
}

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }
  
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const transporter = getTransporter();
  const smtpUser = process.env.SMTP_USER;
  
  if (!transporter || !smtpUser) {
    console.log('[Email] SMTP not configured - logging email instead');
    console.log('[Email] Would send to:', payload.to);
    console.log('[Email] Subject:', payload.subject);
    console.log('[Email] Body preview:', payload.text?.substring(0, 200) + '...');
    return { ok: true };
  }
  
  try {
    const mailOptions = {
      from: `"LocalVR Projections" <${smtpUser}>`,
      to: payload.to,
      replyTo: payload.replyTo || payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent email to ${payload.to}: ${payload.subject} (messageId: ${info.messageId})`);
    return { ok: true };
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return { ok: false, error: String(error) };
  }
}

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

interface ProjectionNotFoundData {
  attemptedUrl: string;
  aeSlug: string;
  slug: string;
  userAgent?: string;
  referer?: string;
  timestamp: string;
}

export function buildProjectionNotFoundEmail(data: ProjectionNotFoundData): EmailPayload {
  const subject = `[Error] Projection Not Found - ${data.slug}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #cc0000;">Projection Not Found Error</h2>
      
      <div style="background-color: #fff3f3; padding: 20px; border-radius: 8px; border: 1px solid #ffcccc; margin-bottom: 20px;">
        <p style="margin: 0;"><strong>Someone tried to access a projection that doesn't exist.</strong></p>
      </div>
      
      <div style="background-color: #f7f4f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333333; margin-top: 0;">Error Details</h3>
        <p><strong>Attempted URL:</strong> <a href="${data.attemptedUrl}">${data.attemptedUrl}</a></p>
        <p><strong>AE Slug:</strong> ${data.aeSlug}</p>
        <p><strong>Property Slug:</strong> ${data.slug}</p>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        ${data.referer ? `<p><strong>Referer:</strong> ${data.referer}</p>` : ''}
        ${data.userAgent ? `<p><strong>User Agent:</strong> ${data.userAgent}</p>` : ''}
      </div>
      
      <p style="font-size: 12px; color: #666666;">
        This error notification was sent automatically by the LocalVR Projections system.
      </p>
    </div>
  `;
  
  const text = `
Projection Not Found Error

Someone tried to access a projection that doesn't exist.

Error Details:
- Attempted URL: ${data.attemptedUrl}
- AE Slug: ${data.aeSlug}
- Property Slug: ${data.slug}
- Timestamp: ${data.timestamp}
${data.referer ? `- Referer: ${data.referer}` : ''}
${data.userAgent ? `- User Agent: ${data.userAgent}` : ''}
  `.trim();
  
  return {
    to: 'sam@golocalvr.com',
    subject,
    html,
    text
  };
}
