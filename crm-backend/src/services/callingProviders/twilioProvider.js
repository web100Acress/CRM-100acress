const axios = require('axios');

function getBasicAuthHeader(accountSid, authToken) {
  const token = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  return `Basic ${token}`;
}

async function startCall({ to, from, webhookUrl, statusCallbackUrl, accountSid, authToken }) {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials missing (accountSid/authToken)');
  }
  if (!from) {
    throw new Error('Twilio from number missing');
  }
  if (!webhookUrl) {
    throw new Error('Twilio webhookUrl missing');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;

  const params = new URLSearchParams();
  params.append('To', to);
  params.append('From', from);
  params.append('Url', webhookUrl);

  if (statusCallbackUrl) {
    params.append('StatusCallback', statusCallbackUrl);
    params.append('StatusCallbackEvent', 'initiated');
    params.append('StatusCallbackEvent', 'ringing');
    params.append('StatusCallbackEvent', 'answered');
    params.append('StatusCallbackEvent', 'completed');
  }

  const resp = await axios.post(url, params, {
    headers: {
      Authorization: getBasicAuthHeader(accountSid, authToken),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 15000,
  });

  return {
    provider: 'twilio',
    providerCallId: resp.data?.sid,
    raw: resp.data,
  };
}

async function endCall({ providerCallId, accountSid, authToken }) {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials missing (accountSid/authToken)');
  }
  if (!providerCallId) {
    throw new Error('providerCallId missing');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${providerCallId}.json`;

  const params = new URLSearchParams();
  params.append('Status', 'completed');

  const resp = await axios.post(url, params, {
    headers: {
      Authorization: getBasicAuthHeader(accountSid, authToken),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 15000,
  });

  return {
    provider: 'twilio',
    providerCallId,
    raw: resp.data,
  };
}

module.exports = { startCall, endCall };
