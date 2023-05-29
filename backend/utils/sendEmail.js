const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// These id's and secrets should come from .env file.
const CLIENT_ID = '791042030465-vt4ltp51qct40th4uo4i9b3da3dsccd4.apps.googleusercontent.com'
const CLEINT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04GNIPYfVSISFCgYIARAAGAQSNwF-L9IrC2KIcXs1LKVhWnmOL2NLFCeNM6EWHBYfgNw2Tu7N-rK7nxN1fcZ2t_lb-rgtYxVQZW8'


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(options) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "nawaz72000@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "nawaz <nawaz72000@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.text,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}


module.exports = sendMail;
