// src/pages/Certificate.tsx

import { useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useRef } from "react";

export default function Certificate() {
  const [params] = useSearchParams();
  const name = params.get("name") || "John Doe";
  const course = params.get("course") || "React Mastery Bootcamp";
  const certId = `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  const certRef = useRef(null);

  const issueDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const downloadCertificate = async () => {
    if (!certRef.current) return;

    const canvas = await html2canvas(certRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    // Optional: specify width/height explicitly
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    pdf.save(`certificate-${name}-${course}.pdf`);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Certificate of Completion</h1>
          <p className="text-muted-foreground">
            Download your course certificate
          </p>
        </div>

        <div className="flex justify-center">
          <Card
            ref={certRef}
            className="w-full max-w-5xl bg-white shadow-lg border-4 border-primary"
          >
            <CardContent className="p-10 text-center space-y-6">
              <h2 className="text-xl text-muted-foreground">
                This is to certify that
              </h2>
              <h1 className="text-4xl font-bold text-primary">{name}</h1>
              <h2 className="text-xl text-muted-foreground">
                has successfully completed the course
              </h2>
              <h1 className="text-3xl font-semibold">{course}</h1>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 mt-6 text-left text-sm gap-6">
                <div>
                  <p className="font-semibold">Certificate ID</p>
                  <p className="font-mono">{certId}</p>
                </div>
                <div>
                  <p className="font-semibold">Date Issued</p>
                  <p>{issueDate}</p>
                </div>
              </div>
              <div className="text-right mt-10 pr-10">
                <p className="font-semibold">Authorized Signature</p>
                <p className="text-sm text-muted-foreground">LMS Team</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <Button onClick={downloadCertificate} className="text-lg px-6 py-2">
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
