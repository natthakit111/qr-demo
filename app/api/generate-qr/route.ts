import { NextResponse } from "next/server";
import generatePayload from "promptpay-qr";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 🔥 ใส่เบอร์ PromptPay จริงของคุณ
    const promptpayId = process.env.PROMPTPAY_ID || "0997621563";

    const payload = generatePayload(promptpayId, {
      amount: amount,
    });

    return NextResponse.json({ payload });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
