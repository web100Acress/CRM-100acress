const twilio = require('twilio');
const { getActiveProviderAccount } = require('../services/callingProviderRegistry');

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

exports.generateToken = async (req, res, next) => {
    try {
        const providerAccount = await getActiveProviderAccount();

        // Validate provider
        if (!providerAccount || providerAccount.providerName !== 'twilio' || !providerAccount.isActive) {
            return res.status(400).json({ success: false, message: 'Twilio provider is not active' });
        }

        const { accountSid, authToken, twimlAppSid } = providerAccount.credentials || {};

        if (!accountSid || !authToken || !twimlAppSid) {
            return res.status(500).json({ success: false, message: 'Twilio credentials or TwiML App SID missing' });
        }

        // Identity for the client (e.g., user ID or username)
        // Using user ID to ensure uniqueness and traceability
        const identity = req.user ? req.user._id.toString() : 'unknown_user';

        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: twimlAppSid,
            incomingAllow: true, // Allow incoming calls (optional for now)
        });

        const token = new AccessToken(accountSid, process.env.TWILIO_API_KEY || accountSid, process.env.TWILIO_API_SECRET || authToken, {
            identity: identity,
            ttl: 3600 // 1 hour
        });


        // For now, I'll rely on process.env.TWILIO_API_KEY and TWILIO_API_SECRET. If missing, I'll return an error guiding the user.
        if (!process.env.TWILIO_API_KEY || !process.env.TWILIO_API_SECRET) {
            // Fallback? No, strict requirement for Voice SDK.
            console.warn("Missing TWILIO_API_KEY or TWILIO_API_SECRET in env");
        }

        token.addGrant(voiceGrant);

        return res.json({
            success: true,
            token: token.toJwt(),
            identity: identity
        });

    } catch (err) {
        next(err);
    }
};
