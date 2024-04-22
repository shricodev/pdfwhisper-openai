"use client";

import { useState } from "react";

import FileUploadDropzone from "@/components/FileUploadDropzone/FileUploadDropzone";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";

const FileUploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) setIsOpen(visible);
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload your PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <FileUploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadButton;
