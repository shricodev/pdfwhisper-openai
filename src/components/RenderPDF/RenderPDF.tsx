"use client";

import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useState } from "react";

type Props = {
  url: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const RenderPDF = ({ url }: Props) => {
  const [numberPages, setNumberPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const { width, ref } = useResizeDetector();
  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            aria-label="previous page"
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input className="h-8 w-12" />
            <p className="space-x-1 text-sm text-zinc-700">
              <span className="text-zinc-500">/</span>
              <span>
                {numberPages ?? (
                  <Loader2 className="inline h-3 w-3 animate-spin" />
                )}
              </span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              aria-label="next page"
              disabled={numberPages === undefined || currPage === numberPages}
              onClick={() => {
                setCurrPage((prev) =>
                  prev + 1 > numberPages! ? numberPages! : prev + 1,
                );
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-screen w-full flex-1">
        <div ref={ref}>
          <Document
            file={url}
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-8 w-8 animate-spin text-primary" />
              </div>
            }
            onLoadSuccess={({ numPages }) => setNumberPages(numPages)}
            onLoadError={() => {
              return toast({
                title: "There was an error rendering the PDF",
                description: "Please try again later",
                variant: "destructive",
              });
            }}
            className="max-h-full"
          >
            <Page pageNumber={currPage} width={width ? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default RenderPDF;
