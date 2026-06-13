"use server";

import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { getPersistentUploadDir } from "@/lib/storage-helper";
import { join } from "path";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename or use custom name
    const customName = formData.get("customName") as string;
    let filename;

    if (customName) {
      // Preserve extension
      const ext = file.name.split(".").pop();
      filename = `${customName}.${ext}`;
    } else {
      const uniqueId = uuidv4();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      filename = `${uniqueId}-${originalName}`;
    }

    // Determine persistent upload directory
    const uploadDir = await getPersistentUploadDir();
    const filepath = join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);
    console.log(`Saved image to: ${filepath}`);

    // Return public path (served via Route Handler)
    const publicPath = `/uploads/${filename}`;
    return { success: true, url: publicPath };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

export const uploadImage = uploadFile;
