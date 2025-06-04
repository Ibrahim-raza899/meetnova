const express = require('express');
const cors = require('cors');
const path = require('path');
const { RtmTokenBuilder, RtmRole, RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());

const APP_ID = '2d37f4302a4a4b5d9d083d58f16481b5';
const APP_CERTIFICATE = '378e806cd65c450ab95215626e6f88a7';

// Route to serve lobby.html directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.html'));
});

// Token generation endpoints
app.get('/get-rtm-token', (req, res) => {
  const uid = req.query.uid;
  const role = RtmRole.Rtm_User;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpiredTs);
  return res.json({ token });
});

app.get('/get-rtc-token', (req, res) => {
  const channelName = req.query.channelName;
  const uid = parseInt(req.query.uid);
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);
  return res.json({ token });
});

// Port config for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
