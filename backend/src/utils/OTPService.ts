import nodemailer from "nodemailer"

class OTPService{
    generateOTP():string{
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOTP(email: string, otp: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Your OTP",
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        })
    }
}

export default new OTPService();