const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

exports.sendEmail = functions.https.onCall(async ({ date, files }, context) => {
  const email = context.auth.token.email;
  const attachments = JSON.parse(files);

  if (!date || !email || !attachments.length) {
    throw new Error();
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nsayerfr@gmail.com",
      pass: "anypalorcs",
    },
  });

  await transporter.sendMail({
    from: '"Nicolas Sayer" <nsayerfr@gmail.com>',
    to: email,
    subject: `Attestations • ${date}`,
    text: "Generated with covid.sayer.fr",
    html: "<b>Generated with covid.sayer.fr</b>",
    attachments,
  });

  return { success: true };
});
