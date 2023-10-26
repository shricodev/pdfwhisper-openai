import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Expand, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { toast } from "@/hooks/use-toast";
import { useResizeDetector } from "react-resize-detector";

interface Props {
  url: string;
}

const FullscreenPDF = ({ url }: Props) => {
  const [numberPages, setNumberPages] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { width, ref } = useResizeDetector();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visibility) => {
        if (!visibility) {
          setIsOpen(visibility);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          aria-label="full screen"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <SimpleBar autoHide={false} className="mt-6 max-h-[calc(100vh-10rem)]">
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
              {new Array(numberPages).fill(0).map((_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  scale={1}
                  width={width ? width : 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenPDF;
