"use client"

import { useState, useCallback } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Building2, QrCode, Loader2, Banknote, CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function QrPaymentGenerator() {
  const [amount, setAmount] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerate = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsLoading(true)
    setIsGenerated(false)
    setQrValue("")

    setTimeout(() => {
      const payload = `PROMPTPAY|0812345678|${amount}`
      setQrValue(payload)
      setIsLoading(false)
      setIsGenerated(true)
    }, 1000)
  }, [amount])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
      if (isGenerated) {
        setIsGenerated(false)
        setQrValue("")
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGenerate()
    }
  }

  const formattedAmount = amount
    ? parseFloat(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <Building2 className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Smart Dormitory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Payment Management System
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <QrCode className="size-5 text-primary" />
              <CardTitle className="text-lg">Generate Payment QR</CardTitle>
            </div>
            <CardDescription>
              Enter the payment amount to generate a PromptPay QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              {/* Amount Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-foreground">
                  <Banknote className="size-4 text-muted-foreground" />
                  Amount (THB)
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {"฿"}
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    onKeyDown={handleKeyDown}
                    className="h-11 pl-8 text-base font-medium tabular-nums"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                size="lg"
                className="w-full text-base font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="size-5" />
                    Generate QR Code
                  </>
                )}
              </Button>

              {/* QR Code Display */}
              {(isLoading || qrValue) && (
                <div className="flex flex-col items-center gap-5 rounded-xl border bg-secondary/50 p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="relative">
                        <div className="size-16 animate-pulse rounded-2xl bg-muted" />
                        <Loader2 className="absolute inset-0 m-auto size-8 animate-spin text-primary" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Generating QR code...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Success badge */}
                      <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">
                          QR Code Ready
                        </span>
                      </div>

                      {/* QR Code */}
                      <div className="rounded-2xl border-2 border-card bg-card p-4 shadow-sm">
                        <QRCodeSVG
                          value={qrValue}
                          size={200}
                          level="H"
                          includeMargin={false}
                        />
                      </div>

                      {/* Amount display */}
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm text-muted-foreground">
                          Payment Amount
                        </p>
                        <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                          {"฿"}{formattedAmount}
                        </p>
                      </div>

                      {/* Encoded data */}
                      <div className="w-full rounded-lg bg-muted/70 px-4 py-2.5">
                        <p className="text-center text-[11px] font-mono text-muted-foreground break-all leading-relaxed">
                          {qrValue}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Smart Dormitory Management System &middot; Demo
        </p>
      </div>
    </div>
  )
}
