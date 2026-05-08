import { Resend } from "resend";
import clientPromise from "../db";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("qyrova");
    const collection = db.collection("otp_codes");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await collection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          otp,
          expires: Date.now() + 5 * 60 * 1000,
        },
      },
      { upsert: true }
    );

    await resend.emails.send({
      from: "Qyrova <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Your Qyrova OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}