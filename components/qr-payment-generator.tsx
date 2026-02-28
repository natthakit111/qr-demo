"use client";

import { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Building2,
  QrCode,
  Loader2,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function QrPaymentGenerator() {
  const [amount, setAmount] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setQrValue("");

    try {
      const res = await fetch("/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate QR");
      }

      setQrValue(data.payload);
    } catch (error) {
      console.error(error);
      alert("Failed to generate QR");
    } finally {
      setIsLoading(false);
    }
  }, [amount]);

  const formattedAmount = amount
    ? parseFloat(amount).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <Building2 className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Smart Dormitory</h1>
          <p className="text-sm text-muted-foreground">
            Dynamic PromptPay QR Payment
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle>Generate Payment QR</CardTitle>
            <CardDescription>
              Enter amount to generate Dynamic PromptPay QR
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label>Amount (THB)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                  ฿
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="size-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </Button>

            {qrValue && (
              <div className="flex flex-col items-center gap-4 rounded-xl border p-6">
                <CheckCircle2 className="size-5 text-green-600" />
                <QRCodeSVG value={qrValue} size={220} level="H" />
                <p className="text-2xl font-bold">฿{formattedAmount}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
