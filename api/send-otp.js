import { Resend } from "resend";
import clientPromise from "../db";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db("qyrova");
    const collection = db.collection("otp_codes");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "qyrovaa@gmail.com",
      subject: "Qyrova OTP Test",
      html: `<h1>${otp}</h1>`,
    });

    return res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}