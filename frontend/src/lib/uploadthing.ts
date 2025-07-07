import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Временная реализация без keycloak для моковых данных
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // TODO: Replace with real Keycloak authentication
      return { userId: "mock-user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 