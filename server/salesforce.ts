interface SalesforceConfig {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
}

interface TokenResponse {
  access_token: string;
  instance_url: string;
  token_type: string;
  issued_at: string;
}

interface LeadInfo {
  Id: string;
  OwnerId: string;
  Name?: string;
  Email?: string;
}

interface TaskPayload {
  WhoId: string;
  Subject: string;
  Description: string;
  ActivityDate: string;
  Status: string;
  OwnerId: string;
}

let cachedToken: { token: string; instanceUrl: string; expiresAt: number } | null = null;

function getConfig(): SalesforceConfig | null {
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  
  if (!instanceUrl || !clientId || !clientSecret) {
    return null;
  }
  
  return { instanceUrl, clientId, clientSecret };
}

interface AuthResult {
  auth: { token: string; instanceUrl: string } | null;
  error?: string;
}

async function getAccessToken(): Promise<AuthResult> {
  const config = getConfig();
  if (!config) {
    const error = 'Missing credentials (need SALESFORCE_INSTANCE_URL, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET)';
    console.log('[Salesforce]', error);
    return { auth: null, error };
  }
  
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return { auth: { token: cachedToken.token, instanceUrl: cachedToken.instanceUrl } };
  }
  
  try {
    const tokenUrl = `${config.instanceUrl}/services/oauth2/token`;
    console.log('[Salesforce] Requesting OAuth token from:', tokenUrl);
    
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret
    });
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      const error = `OAuth HTTP ${response.status}: ${errorText}`;
      console.error('[Salesforce] OAuth token request failed:', error);
      return { auth: null, error };
    }
    
    const tokenData = await response.json() as TokenResponse;
    
    cachedToken = {
      token: tokenData.access_token,
      instanceUrl: tokenData.instance_url,
      expiresAt: Date.now() + (55 * 60 * 1000)
    };
    
    console.log('[Salesforce] OAuth token obtained successfully via client_credentials, instance:', tokenData.instance_url);
    return { auth: { token: tokenData.access_token, instanceUrl: tokenData.instance_url } };
  } catch (error) {
    const errorMsg = `OAuth exception: ${String(error)}`;
    console.error('[Salesforce] Error getting OAuth token:', error);
    return { auth: null, error: errorMsg };
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export async function updateLeadProjectionUrl(
  leadId: string, 
  trackingUrl: string
): Promise<{ ok: boolean; error?: string }> {
  const { auth, error: authError } = await getAccessToken();
  if (!auth) {
    console.log('[Salesforce] Skipping Lead update - could not get access token');
    return { ok: false, error: authError || 'Could not obtain access token' };
  }
  
  try {
    const response = await fetch(
      `${auth.instanceUrl}/services/data/v59.0/sobjects/Lead/${leadId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Projection_URL__c: trackingUrl
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Salesforce] Failed to update Lead:', errorText);
      return { ok: false, error: errorText };
    }
    
    console.log(`[Salesforce] Updated Lead ${leadId} with Projection_URL__c`);
    return { ok: true };
  } catch (error) {
    console.error('[Salesforce] Error updating Lead:', error);
    return { ok: false, error: String(error) };
  }
}

export async function getLeadOwner(leadId: string): Promise<{ lead: LeadInfo | null; error?: string }> {
  const { auth, error: authError } = await getAccessToken();
  if (!auth) {
    console.log('[Salesforce] Skipping Lead fetch - could not get access token');
    return { lead: null, error: authError || 'Could not obtain access token' };
  }
  
  try {
    const url = `${auth.instanceUrl}/services/data/v59.0/sobjects/Lead/${leadId}?fields=Id,OwnerId,Name,Email`;
    console.log(`[Salesforce] Fetching Lead: ${leadId}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Salesforce] Failed to fetch Lead:', response.status, errorText);
      return { lead: null, error: `HTTP ${response.status}: ${errorText}` };
    }
    
    const lead = await response.json() as LeadInfo;
    console.log(`[Salesforce] Lead fetched successfully: ${lead.Name || lead.Id}`);
    return { lead };
  } catch (error) {
    console.error('[Salesforce] Error fetching Lead:', error);
    return { lead: null, error: `Exception: ${String(error)}` };
  }
}

export async function createTask(
  leadId: string,
  ownerId: string,
  subject: string,
  description: string
): Promise<{ ok: boolean; taskId?: string; error?: string }> {
  const { auth, error: authError } = await getAccessToken();
  if (!auth) {
    console.log('[Salesforce] Skipping Task creation - could not get access token');
    return { ok: false, error: authError || 'Could not obtain access token' };
  }
  
  try {
    const taskPayload: TaskPayload = {
      WhoId: leadId,
      Subject: subject,
      Description: description,
      ActivityDate: getTodayDate(),
      Status: 'Not Started',
      OwnerId: ownerId
    };
    
    const response = await fetch(
      `${auth.instanceUrl}/services/data/v59.0/sobjects/Task`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskPayload)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Salesforce] Failed to create Task:', errorText);
      return { ok: false, error: errorText };
    }
    
    const result = await response.json() as { id: string };
    console.log(`[Salesforce] Created Task ${result.id} for Lead ${leadId}`);
    return { ok: true, taskId: result.id };
  } catch (error) {
    console.error('[Salesforce] Error creating Task:', error);
    return { ok: false, error: String(error) };
  }
}

export async function createClickTrackingTask(
  leadId: string,
  slug: string
): Promise<{ ok: boolean; taskId?: string; error?: string }> {
  const { lead, error } = await getLeadOwner(leadId);
  
  if (!lead) {
    return { ok: false, error: error || 'Could not fetch Lead info' };
  }
  
  return createTask(
    leadId,
    lead.OwnerId,
    'Projection link clicked – follow up',
    `Lead clicked projection link for slug ${slug}.`
  );
}

export async function createFormSubmissionTask(
  leadId: string,
  slug: string,
  message?: string
): Promise<{ ok: boolean; error?: string }> {
  const { lead, error } = await getLeadOwner(leadId);
  
  if (!lead) {
    return { ok: false, error: error || 'Could not fetch Lead info' };
  }
  
  const description = message 
    ? `Homeowner submitted the projection page form for slug ${slug}. Message: ${message}`
    : `Homeowner submitted the projection page form for slug ${slug}.`;
  
  return createTask(
    leadId,
    lead.OwnerId,
    'Projection landing page form submitted',
    description
  );
}

export function isSalesforceConfigured(): boolean {
  return getConfig() !== null;
}

export async function testSalesforceConnection(): Promise<{ 
  ok: boolean; 
  configured: boolean;
  tokenObtained: boolean;
  error?: string;
}> {
  const config = getConfig();
  if (!config) {
    return { 
      ok: false, 
      configured: false, 
      tokenObtained: false,
      error: 'Salesforce credentials not configured (missing SALESFORCE_INSTANCE_URL, SALESFORCE_CLIENT_ID, or SALESFORCE_CLIENT_SECRET)'
    };
  }
  
  try {
    const tokenUrl = `${config.instanceUrl}/services/oauth2/token`;
    
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret
    });
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { 
        ok: false, 
        configured: true, 
        tokenObtained: false,
        error: `OAuth failed: ${errorText}`
      };
    }
    
    const tokenData = await response.json() as TokenResponse;
    
    cachedToken = {
      token: tokenData.access_token,
      instanceUrl: tokenData.instance_url,
      expiresAt: Date.now() + (55 * 60 * 1000)
    };
    
    return { 
      ok: true, 
      configured: true, 
      tokenObtained: true 
    };
  } catch (error) {
    return { 
      ok: false, 
      configured: true, 
      tokenObtained: false,
      error: `Exception: ${error}`
    };
  }
}
