const functions = require("firebase-functions");
const admin = require("firebase-admin");

const attestFrCovid = require("attest-fr-covid");
const nodemailer = require("nodemailer");

admin.initializeApp();
let db = admin.firestore();

const cleanDoc = (doc) => {
  return { uid: doc.id, ref: doc.ref, ...doc.data() };
};

const cleanSnapshot = (snapshot) => {
  if (Array.isArray(snapshot.docs)) {
    return snapshot.docs
      .map((doc) => {
        return cleanDoc(doc);
      })
      .filter(Boolean);
  }

  return cleanDoc(snapshot);
};

const REASONS = [
  { slug: "work", name: "Travail" },
  { slug: "buy", name: "Courses" },
  { slug: "health", name: "Santé" },
  { slug: "family", name: "Famille" },
  { slug: "handicap", name: "Handicap" },
  { slug: "sport", name: "Balade / Sport" },
  { slug: "legal", name: "Judiciare" },
  { slug: "mission", name: "Intérêt général" },
  { slug: "child", name: "École" },
];

const checkProfile = (profile) => {
  return (
    profile.firstName &&
    profile.lastName &&
    profile.birthPlace &&
    profile.address &&
    profile.city &&
    profile.zipCode &&
    new Date(profile.birthDate.seconds * 1000) !== "Invalid Date"
  );
};

exports.sendCertificates = functions.https.onCall(async (data, context) => {
  const email = context.auth.token.email;

  const profiles = await db
    .collection(`users/${email}/profiles`)
    .where(admin.firestore.FieldPath.documentId(), "in", data.profiles)
    .get()
    .then(cleanSnapshot)
    .then((profiles) =>
      profiles.map((profile) => {
        if (!checkProfile) {
          throw new Error("Profile is corrupted");
        }
        return {
          uid: profile.uid,
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthday: new Date(profile.birthDate.seconds * 1000),
          placeOfBirth: profile.birthPlace,
          address: profile.address,
          city: profile.city,
          postalCode: profile.zipCode,
        };
      })
    );

  await db
    .collection("users")
    .doc(email)
    .set({
      reasons: data.reasons,
      profiles: profiles.map((profile) => profile.uid),
    });

  const validReasons = REASONS.filter((reason) =>
    data.reasons.includes(reason.slug)
  );

  if (
    new Date(data.date) === "Invalid Date" ||
    !profiles.length ||
    !validReasons.length
  ) {
    throw new Error("Missing informations");
  }

  const attachments = await Promise.all(
    validReasons.flatMap((reason, reasonIndex) =>
      profiles.map((profile, userIndex) => {
        return attestFrCovid.default(profile, new Date(data.date), [
          reason.slug,
        ]);
      })
    )
  ).then((buffers) =>
    validReasons.flatMap((reason, reasonIndex) =>
      profiles.map((profile, userIndex) => ({
        filename: `${profile.firstName[0]}_${profile.lastName}_${reason.name}_${profile.address}.pdf`,
        content: buffers[reasonIndex * profiles.length + userIndex],
      }))
    )
  );

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
    subject: `Attestations • ${new Date(data.date).toLocaleDateString("fr", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    text: "Generated with covid.sayer.fr",
    html: "<b>Generated with covid.sayer.fr</b>",
    attachments,
  });

  return { success: true };
});
