import clientPromise from "../db"; // adjust path if needed

export default async function handler(req, res) {
  const { email, otp } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const client = await clientPromise;
    const db = client.db("qyrova");
    const collection = db.collection("otp_codes");

    const record = await collection.findOne({ email: normalizedEmail });

    console.log("VERIFY:", otp, record);

    if (!record) {
      return res.status(400).json({ success: false, message: "No OTP found" });
    }

    if (Date.now() > record.expires) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.otp.toString() !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await collection.deleteOne({ email: normalizedEmail });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}