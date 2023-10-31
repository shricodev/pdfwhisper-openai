"use client";

import { useState } from "react";

import FileUploadDropzone from "../FileUploadDropzone/FileUploadDropzone";

import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";

const FileUploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload your PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <FileUploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadButton;
