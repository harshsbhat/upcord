import { createUploadthing, type FileRouter } from "uploadthing/next";
import { generateReactHelpers } from "@uploadthing/react";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
      acceptedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"]
    }
  })
    .middleware(async () => {
      // Verify user is authenticated using Better Auth
      const session = await auth({ cookies });
      if (!session?.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      if (!file.url) throw new Error("No URL received from upload");
      
      // Return a simple object with just the URL
      return {
        url: file.url
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { useUploadThing } = generateReactHelpers<OurFileRouter>(); 