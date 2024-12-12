import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import jsPDF from "jspdf";

const loginLink = "/issue-form-guest-qr/login/token";

const IssueFormQR = () => {
  const qrRef = useRef(null);

  const downloadQRCodeAsPDF = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const qrSize = 100; // Size of the QR code in the PDF
      const x = (pageWidth - qrSize) / 2;
      const y = (pageHeight - qrSize) / 2;

      pdf.text("Scan this QR code to report systemic issues.", x, y - 10);
      pdf.addImage(pngFile, "PNG", x, y, qrSize, qrSize);
      pdf.save("qr-code.pdf");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>QR</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] sm:max-h-[500px] justify-center">
        <DialogTitle className="wrap-text">
          Share with guest users to <br />
          submit issue form.
        </DialogTitle>
        <div className="items-center" ref={qrRef}>
          <QRCodeSVG value={loginLink} size={256} />
        </div>
        <Button onClick={downloadQRCodeAsPDF} className="mt-4">
          Download QR Code as PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormQR;
