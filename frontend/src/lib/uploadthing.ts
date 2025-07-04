import { createUploadthing, type FileRouter } from "uploadthing/next";
import keycloak from "./keycloak";
import { generateComponents } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const isAuthenticated = await keycloak.init({
        onLoad: 'check-sso',
      });

      if (!isAuthenticated) {
        throw new Error("Unauthorized");
      }

      const userProfile = await keycloak.loadUserProfile();

      return { userId: userProfile.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { UploadButton, UploadDropzone, useUploadThing } = generateComponents<OurFileRouter>(); 