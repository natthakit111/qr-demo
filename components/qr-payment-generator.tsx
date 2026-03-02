"use client";

import { useState, useMemo, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Building2,
  QrCode,
  Loader2,
  CheckCircle2,
  Printer,
  FileText,
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
import { Separator } from "@/components/ui/separator";

function formatCurrency(n: number) {
  return n.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function QrPaymentGenerator() {
  // ------------------ ข้อมูลบิล ------------------
  const [ห้อง, setห้อง] = useState("A-101");
  const [ชื่อผู้เช่า, setชื่อผู้เช่า] = useState("นายตัวอย่าง");
  const [เดือน, setเดือน] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );

  const [ค่าเช่า, setค่าเช่า] = useState("3500");
  const [หน่วยน้ำ, setหน่วยน้ำ] = useState("10");
  const [ราคาน้ำ, setราคาน้ำ] = useState("20");
  const [หน่วยไฟ, setหน่วยไฟ] = useState("100");
  const [ราคาไฟ, setราคาไฟ] = useState("8");

  // ------------------ QR ------------------
  const [qrValue, setQrValue] = useState("");
  const [กำลังโหลด, setกำลังโหลด] = useState(false);

  // ------------------ คำนวณ ------------------
  const ค่าน้ำ = useMemo(
    () => (parseFloat(หน่วยน้ำ) || 0) * (parseFloat(ราคาน้ำ) || 0),
    [หน่วยน้ำ, ราคาน้ำ],
  );

  const ค่าไฟ = useMemo(
    () => (parseFloat(หน่วยไฟ) || 0) * (parseFloat(ราคาไฟ) || 0),
    [หน่วยไฟ, ราคาไฟ],
  );

  const ยอดรวม = useMemo(
    () => (parseFloat(ค่าเช่า) || 0) + ค่าน้ำ + ค่าไฟ,
    [ค่าเช่า, ค่าน้ำ, ค่าไฟ],
  );

  const เลขที่ใบแจ้งหนี้ = useMemo(() => {
    const ปี = เดือน.slice(0, 4);
    const เดือนเลข = เดือน.slice(5, 7);
    return `INV-${ปี}${เดือนเลข}-${ห้อง.replace(/\W/g, "")}`;
  }, [เดือน, ห้อง]);

  // ------------------ สร้าง QR ------------------
  const สร้างQR = useCallback(async () => {
    if (!ยอดรวม || ยอดรวม <= 0) return;
    setกำลังโหลด(true);
    setQrValue("");

    try {
      const res = await fetch("/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: ยอดรวม }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      setQrValue(data.payload);
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถสร้าง QR ได้");
    } finally {
      setกำลังโหลด(false);
    }
  }, [ยอดรวม]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
        {/* ---------------- ฟอร์มกรอกข้อมูล ---------------- */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
                <Building2 className="size-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>ระบบออกใบแจ้งหนี้หอพัก</CardTitle>
                <CardDescription>
                  คำนวณค่าสาธารณูปโภค และสร้าง QR PromptPay แบบระบุยอด
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>เลขห้อง</Label>
                <Input value={ห้อง} onChange={(e) => setห้อง(e.target.value)} />
              </div>
              <div>
                <Label>ชื่อผู้เช่า</Label>
                <Input
                  value={ชื่อผู้เช่า}
                  onChange={(e) => setชื่อผู้เช่า(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>ประจำเดือน</Label>
              <Input
                type="month"
                value={เดือน}
                onChange={(e) => setเดือน(e.target.value)}
              />
            </div>

            <Separator />

            <div>
              <Label>ค่าเช่าห้อง (บาท)</Label>
              <Input
                type="number"
                value={ค่าเช่า}
                onChange={(e) => setค่าเช่า(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>หน่วยน้ำ</Label>
                <Input
                  type="number"
                  value={หน่วยน้ำ}
                  onChange={(e) => setหน่วยน้ำ(e.target.value)}
                />
              </div>
              <div>
                <Label>ราคาน้ำต่อหน่วย</Label>
                <Input
                  type="number"
                  value={ราคาน้ำ}
                  onChange={(e) => setราคาน้ำ(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>หน่วยไฟ</Label>
                <Input
                  type="number"
                  value={หน่วยไฟ}
                  onChange={(e) => setหน่วยไฟ(e.target.value)}
                />
              </div>
              <div>
                <Label>ราคาไฟต่อหน่วย</Label>
                <Input
                  type="number"
                  value={ราคาไฟ}
                  onChange={(e) => setราคาไฟ(e.target.value)}
                />
              </div>
            </div>

            <div className="text-right text-xl font-semibold">
              ยอดรวม: ฿{formatCurrency(ยอดรวม)}
            </div>

            <Button
              onClick={สร้างQR}
              disabled={!ยอดรวม || ยอดรวม <= 0 || กำลังโหลด}
              className="w-full"
            >
              {กำลังโหลด ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  กำลังสร้าง QR...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 size-4" />
                  สร้าง QR ชำระเงิน
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ---------------- ใบแจ้งหนี้ ---------------- */}
        <Card className="shadow-lg print:shadow-none">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4" />
                ใบแจ้งหนี้
              </CardTitle>
              <CardDescription>{เลขที่ใบแจ้งหนี้}</CardDescription>
            </div>

            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="size-4 mr-2" />
              พิมพ์ใบแจ้งหนี้
            </Button>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <p>
              <strong>เลขห้อง:</strong> {ห้อง}
            </p>
            <p>
              <strong>ชื่อผู้เช่า:</strong> {ชื่อผู้เช่า}
            </p>
            <p>
              <strong>เดือน:</strong> {เดือน}
            </p>

            <Separator />

            <div className="flex justify-between">
              <span>ค่าเช่า</span>
              <span>฿{formatCurrency(parseFloat(ค่าเช่า) || 0)}</span>
            </div>

            <div className="flex justify-between">
              <span>
                ค่าน้ำ ({หน่วยน้ำ} × {ราคาน้ำ})
              </span>
              <span>฿{formatCurrency(ค่าน้ำ)}</span>
            </div>

            <div className="flex justify-between">
              <span>
                ค่าไฟ ({หน่วยไฟ} × {ราคาไฟ})
              </span>
              <span>฿{formatCurrency(ค่าไฟ)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>ยอดรวม</span>
              <span>฿{formatCurrency(ยอดรวม)}</span>
            </div>

            {qrValue && (
              <div className="flex flex-col items-center gap-3 pt-4">
                <CheckCircle2 className="size-5 text-green-600" />
                <QRCodeSVG value={qrValue} size={200} level="H" />
                <p className="text-sm text-muted-foreground">
                  สแกนเพื่อชำระเงิน ฿{formatCurrency(ยอดรวม)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
