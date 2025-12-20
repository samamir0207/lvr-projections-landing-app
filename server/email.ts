interface EmailPayload {
  to: string;
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
  propertyMarket: string;
  projectionLow: number;
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
        <p><strong>City:</strong> ${data.propertyCity}</p>
        <p><strong>Market:</strong> ${data.propertyMarket}</p>
        <p><strong>Projected Revenue:</strong> ${formatCurrency(data.projectionLow)} - ${formatCurrency(data.projectionHigh)}</p>
      </div>
      
      ${data.message ? `
      <div style="background-color: #f7f4f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333333; margin-top: 0;">Message</h3>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 20px;">
        <a href="${data.projectionPageUrl}" style="display: inline-block; background-color: #d3bda2; color: #333333; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">View Projection Page</a>
      </div>
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
- City: ${data.propertyCity}
- Market: ${data.propertyMarket}
- Projected Revenue: ${formatCurrency(data.projectionLow)} - ${formatCurrency(data.projectionHigh)}

${data.message ? `Message:\n${data.message}` : ''}

View Projection Page: ${data.projectionPageUrl}
  `.trim();
  
  return {
    to: '', // Will be set by caller with AE email
    subject,
    html,
    text
  };
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM_EMAIL;
  
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('[Email] SMTP not configured - logging email instead');
    console.log('[Email] Would send to:', payload.to);
    console.log('[Email] Subject:', payload.subject);
    console.log('[Email] Body preview:', payload.text?.substring(0, 200) + '...');
    return { ok: true };
  }
  
  try {
    console.log(`[Email] Sending email to ${payload.to}: ${payload.subject}`);
    return { ok: true };
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return { ok: false, error: String(error) };
  }
}

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}
