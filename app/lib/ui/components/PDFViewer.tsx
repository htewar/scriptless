"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";

interface PDFViewerProps {
  pdfLink: string;
}

export default function PDFViewer({ pdfLink }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDocumentLoadError = () => {
    setError("Failed to load PDF");
  };

  return (
    <div className="p-2 w-full h-full">
      <div className="border border-primary bg-white p-4 h-full rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Preview</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfLink, "_blank")}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="w-full h-[780px] overflow-auto">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfLink}
              onDocumentLoad={handleDocumentLoadError}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}
