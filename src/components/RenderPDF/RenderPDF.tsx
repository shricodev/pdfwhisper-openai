"use client";

import { useState } from "react";

import { z } from "zod";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResizeDetector } from "react-resize-detector";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  SearchIcon,
} from "lucide-react";

import FullscreenPDF from "@/components/FullscreenPDF/FullscreenPDF";

import { toast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";

interface Props {
  url: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const RenderPDF = ({ url }: Props) => {
  const [numberPages, setNumberPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  // To show the previous scaled page, unless the new page is rendered. This helps reduce flicker when changing scale.
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const { width, ref } = useResizeDetector();

  const isLoading = renderedScale !== null && renderedScale !== scale;

  const CustomPageLoadValidator = z.object({
    index: z
      .string()
      .refine((val) => Number(val) > 0 && Number(val) <= numberPages!),
  });

  type TCustomPageLoad = z.infer<typeof CustomPageLoadValidator>;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TCustomPageLoad>({
    defaultValues: {
      index: "1",
    },
    resolver: zodResolver(CustomPageLoadValidator),
  });

  const handlePageSubmit = ({ index }: TCustomPageLoad) => {
    setCurrPage(Number(index));
    setValue("index", String(index));
  };

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
              setValue("index", String(currPage - 1));
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("index")}
              className={cn(
                "h-8 w-12",
                errors.index && "focus-visible:ring-red-500",
              )}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
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
                setValue("index", String(currPage + 1));
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              aria-label="rotate"
              variant="ghost"
              size="sm"
              onClick={() => setRotation((prev) => prev + 90)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <FullscreenPDF url={url} />
          </div>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="zoom in/out"
                variant="ghost"
                size="sm"
                className="gap-1.5"
              >
                <SearchIcon className="h-4 w-4" />
                {scale * 100}% <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
              {/* To show the previous scaled page, unless the new page is rendered. */}
              {isLoading && renderedScale ? (
                <Page
                  key={"page_scale" + currPage + renderedScale}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  width={width ? width : 1}
                />
              ) : null}

              {/* The new scaled page. */}
              <Page
                key={"page_scale" + currPage + scale}
                className={cn(isLoading ? "hidden" : null)}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                width={width ? width : 1}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-8 w-8 animate-spin text-primary" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default RenderPDF;
