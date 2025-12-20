interface SalesforceConfig {
  instanceUrl: string;
  accessToken: string;
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

function getConfig(): SalesforceConfig | null {
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  const accessToken = process.env.SALESFORCE_ACCESS_TOKEN;
  
  if (!instanceUrl || !accessToken) {
    return null;
  }
  
  return { instanceUrl, accessToken };
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export async function updateLeadProjectionUrl(
  leadId: string, 
  trackingUrl: string
): Promise<{ ok: boolean; error?: string }> {
  const config = getConfig();
  
  if (!config) {
    console.log('[Salesforce] Skipping Lead update - credentials not configured');
    return { ok: true };
  }
  
  try {
    const response = await fetch(
      `${config.instanceUrl}/services/data/v59.0/sobjects/Lead/${leadId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
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

export async function getLeadOwner(leadId: string): Promise<LeadInfo | null> {
  const config = getConfig();
  
  if (!config) {
    console.log('[Salesforce] Skipping Lead fetch - credentials not configured');
    return null;
  }
  
  try {
    const response = await fetch(
      `${config.instanceUrl}/services/data/v59.0/sobjects/Lead/${leadId}?fields=Id,OwnerId,Name,Email`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Salesforce] Failed to fetch Lead:', errorText);
      return null;
    }
    
    const lead = await response.json() as LeadInfo;
    return lead;
  } catch (error) {
    console.error('[Salesforce] Error fetching Lead:', error);
    return null;
  }
}

export async function createTask(
  leadId: string,
  ownerId: string,
  subject: string,
  description: string
): Promise<{ ok: boolean; taskId?: string; error?: string }> {
  const config = getConfig();
  
  if (!config) {
    console.log('[Salesforce] Skipping Task creation - credentials not configured');
    return { ok: true };
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
      `${config.instanceUrl}/services/data/v59.0/sobjects/Task`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
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
): Promise<{ ok: boolean; error?: string }> {
  const lead = await getLeadOwner(leadId);
  
  if (!lead) {
    return { ok: false, error: 'Could not fetch Lead info' };
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
  const lead = await getLeadOwner(leadId);
  
  if (!lead) {
    return { ok: false, error: 'Could not fetch Lead info' };
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
