import { storage } from "@/lib/firebase";
import { ref, getDownloadURL } from "firebase/storage";

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getImageUrl(path: string): Promise<string> {
    try {
      if (!storage) {
        throw new Error("Firebase Storage is not initialized");
      }

      // If the path is already a full URL, return it
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }

      // If it's a local path starting with "/", return it
      if (path.startsWith("/")) {
        return path;
      }

      // Otherwise, get the download URL from Firebase Storage
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return "/placeholder.png"; // Return placeholder on error
    }
  }
}

export const storageService = StorageService.getInstance(); 