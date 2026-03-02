import { NextResponse } from "next/server";
import generatePayload from "promptpay-qr";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const promptpayId = "0997621563"; //  ใส่เบอร์คุณ
    const payload = generatePayload(promptpayId, { amount });

    return NextResponse.json({ payload });
  } catch (error) {
    return NextResponse.json(
      { error: "QR generation failed" },
      { status: 500 },
    );
  }
}
