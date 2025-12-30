const crypto = require('crypto');

function createProviderCallId() {
  return `stub_${crypto.randomBytes(8).toString('hex')}`;
}

async function startCall({ to }) {
  return {
    provider: 'stub',
    providerCallId: createProviderCallId(),
    to,
  };
}

async function endCall({ providerCallId }) {
  return { provider: 'stub', providerCallId };
}

module.exports = { startCall, endCall };
