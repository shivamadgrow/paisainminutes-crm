export const INITIAL_INTEGRATIONS = [
  {
    partnerId: 'rupay91',
    partnerName: 'Rupay91',
    apiEndpoint: 'https://api.rupay91.com/v2/leads/ingest',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/rupay91/callback',
    apiKey: 'sk_live_rup91_8829102847192847',
    secretKey: 'sec_live_91_d82910fa8c829e0',
    status: 'Connected', // 'Connected' | 'Error' | 'Paused'
    lastSync: '2 minutes ago',
    method: 'REST JSON POST',
    authType: 'Bearer Token + HMAC SHA256'
  },
  {
    partnerId: 'jhatpat',
    partnerName: 'Jhatpat Loans',
    apiEndpoint: 'https://partners.jhatpatloans.com/api/v1/applications',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/jhatpat/status',
    apiKey: 'jhpt_live_92817263541829',
    secretKey: 'jhpt_sec_892182746152',
    status: 'Connected',
    lastSync: '14 minutes ago',
    method: 'REST JSON POST',
    authType: 'API Key Header'
  },
  {
    partnerId: 'instarupees',
    partnerName: 'Insta Rupees',
    apiEndpoint: 'https://gateway.instarupees.in/affiliates/lead-push',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/instarupees/disbursal',
    apiKey: 'inst_live_839201948201',
    secretKey: 'inst_sec_382910485720',
    status: 'Connected',
    lastSync: '1 hour ago',
    method: 'REST JSON POST',
    authType: 'Bearer Token'
  },
  {
    partnerId: 'udhaarnow',
    partnerName: 'UdhaarNow',
    apiEndpoint: 'https://api.udhaarnow.co/leads/sync',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/udhaarnow/events',
    apiKey: 'udh_live_194820194820',
    secretKey: 'udh_sec_938102948201',
    status: 'Connected',
    lastSync: '35 minutes ago',
    method: 'REST JSON POST',
    authType: 'Basic Auth'
  },
  {
    partnerId: 'loanwithin',
    partnerName: 'LoanWithin',
    apiEndpoint: 'https://integrate.loanwithin.com/v1/inbound',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/loanwithin/status',
    apiKey: 'lw_live_482910482910',
    secretKey: 'lw_sec_294810394820',
    status: 'Connected',
    lastSync: '4 hours ago',
    method: 'REST JSON POST',
    authType: 'Bearer Token'
  },
  {
    partnerId: 'shubhcash',
    partnerName: 'ShubhCash',
    apiEndpoint: 'https://partner-api.shubhcash.in/lead/receive',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/shubhcash/update',
    apiKey: 'shubh_live_920194820192',
    secretKey: 'shubh_sec_192039482019',
    status: 'Connected',
    lastSync: '2 hours ago',
    method: 'REST JSON POST',
    authType: 'Bearer Token'
  },
  {
    partnerId: 'borrowera',
    partnerName: 'Borrowera',
    apiEndpoint: 'https://api.borrowera.com/v3/fintech-leads',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/borrowera/callbacks',
    apiKey: 'brw_live_839201948291',
    secretKey: 'brw_sec_839201948291',
    status: 'Connected',
    lastSync: '5 hours ago',
    method: 'REST JSON POST',
    authType: 'HMAC Header'
  },
  {
    partnerId: 'easyfincare',
    partnerName: 'Easy Fincare',
    apiEndpoint: 'https://api.easyfincare.com/crm/direct-lead',
    webhookUrl: 'https://crm.paisainminutes.com/api/webhooks/easyfincare/postback',
    apiKey: 'ef_live_938102948201',
    secretKey: 'ef_sec_382910482910',
    status: 'Connected',
    lastSync: '6 hours ago',
    method: 'REST JSON POST',
    authType: 'Bearer Token'
  }
];
