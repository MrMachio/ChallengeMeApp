import { generateComponents } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, useUploadThing } = generateComponents<OurFileRouter>(); 