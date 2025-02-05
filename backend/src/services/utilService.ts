import { StorageClient } from "@supabase/storage-js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class ImageService {
  private supabaseStorage;

  constructor() {
    this.supabaseStorage = new StorageClient(
      `${process.env.SUPABASE_URL}/storage/v1`,
      {
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
      }
    );
  }

  static upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Invalid file type. Only JPEG, PNG and WebP are allowed.")
        );
      }
    },
  }).single("image");

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = fileName;

      const { data, error } = await this.supabaseStorage
        .from("event-management")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const publicUrl = this.supabaseStorage
        .from("event-management")
        .getPublicUrl(filePath).data.publicUrl;

      return publicUrl;
    } catch (error: any) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
}
