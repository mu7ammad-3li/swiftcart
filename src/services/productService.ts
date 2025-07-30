import { db } from "../lib/firebase"; // Import the Firestore instance
import {
  getDocs,
  doc,
  getDoc,
  collection,
  DocumentData,
} from "firebase/firestore";
import { Product } from "../data/products"; // Import the Product interface from data folder
import { storageService } from "./storage/storageService";

/**
 * Retrieves all products from the 'products' collection in Firestore.
 * @returns A promise that resolves to an array of Product objects, or an empty array on error.
 */
const getProducts = async (): Promise<Product[]> => {
  try {
    // Ensure db is initialized
    if (!db) {
      throw new Error("Firestore database is not initialized.");
    }
    const productsCol = collection(db, "products");
    const productsSnapshot = await getDocs(productsCol);
    
    const products = await Promise.all(productsSnapshot.docs.map(async (doc) => {
      const data = doc.data() as DocumentData;
      const imageUrl = await storageService.getImageUrl(data.image || "/placeholder.png");
      
      return {
        id: doc.id,
        name: data.name || "Unnamed Product",
        image: imageUrl,
        price: data.price || "0",
        shortDescription: data.shortDescription || "",
        FreeDelivery: data.FreeDelivery || false,
        featured: data.featured || false,
        onSale: data.onSale || false,
        salePrice: data.salePrice || undefined,
        details: data.details || {
          longDescription: "",
          features: [],
          instructions: [],
        },
      } as Product;
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on error
  }
};

/**
 * Retrieves a single product from the 'products' collection by its ID.
 * @param productId - The ID of the product to retrieve.
 * @returns A promise that resolves to a Product object if found, or null if not found or on error.
 */
const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    // Ensure db is initialized
    if (!db) {
      throw new Error("Firestore database is not initialized.");
    }
    const productDocRef = doc(db, "products", productId);
    const productDocSnap = await getDoc(productDocRef);

    if (productDocSnap.exists()) {
      const data = productDocSnap.data() as DocumentData;
      const imageUrl = await storageService.getImageUrl(data.image || "/placeholder.png");
      
      return {
        id: productDocSnap.id,
        name: data.name || "Unnamed Product",
        image: imageUrl,
        price: data.price || "0",
        shortDescription: data.shortDescription || "",
        FreeDelivery: data.FreeDelivery || false,
        featured: data.featured || false,
        onSale: data.onSale || false,
        salePrice: data.salePrice || undefined,
        details: data.details || {
          longDescription: "",
          features: [],
          instructions: [],
        },
      } as Product; // Assert the type
    } else {
      console.log(`Product with ID ${productId} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null; // Return null on error
  }
};

export { getProducts, getProductById };
