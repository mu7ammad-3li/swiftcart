// src/services/orderService.ts (Updated getOrders and getOrderById)

import { db } from "../lib/firebase"; //
import {
  getDocs,
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc, // Keep if using addInternalNoteToOrder
  arrayUnion, // Keep if using addInternalNoteToOrder
  Timestamp,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { Order, OrderItem, InternalNote } from "../data/order"; //

// Define the type for the payload, excluding the timestamp which server will set
type InitialNotePayload = Omit<InternalNote, "timestamp">;

const createOrder = async (
  orderData: Omit<Order, "id" | "internalNotes">,
  initialNotePayload?: InitialNotePayload
): Promise<string> => {
  try {
    if (!db) {
      //
      throw new Error("Firestore database is not initialized."); //
    }

    const { notes, ...restOfOrderData } = orderData;

    // Prepare the internalNotes array
    let internalNotesArray: InternalNote[] = [];
    const clientTimestamp = Timestamp.now(); // <-- Get client timestamp ONCE

    if (initialNotePayload) {
      // If a payload is provided, use it and add the CLIENT timestamp
      internalNotesArray.push({
        ...initialNotePayload,
        // === CHANGE: Use client timestamp ===
        timestamp: clientTimestamp,
        // =====================================
      });
    } else {
      // OPTIONAL FALLBACK: Create a minimal default note if none is provided
      internalNotesArray.push({
        title: "Order Created",
        summary: `Order created for customer ${orderData.customerId}. Note payload not provided.`,
        createdBy: "System (Default)",
        // === CHANGE: Use client timestamp ===
        timestamp: clientTimestamp,
        // =====================================
      });
      console.warn(
        "Initial note payload not provided to createOrder, using default."
      );
    }

    const dataToSave: DocumentData = {
      ...restOfOrderData,
      // Use client timestamp for orderDate consistency if desired, or keep as is
      orderDate: Timestamp.fromDate(orderData.orderDate || new Date()),
      // Conditionally add customer notes
      ...(notes && { notes: notes }),
      // Add the prepared internalNotes array (now with client timestamp)
      internalNotes: internalNotesArray,
    };

    console.log("Order data being saved:", dataToSave);

    const orderCollectionRef = collection(db, "orders"); //
    const newOrderDocRef = await addDoc(orderCollectionRef, dataToSave); //
    console.log("Order created with ID:", newOrderDocRef.id);
    return newOrderDocRef.id;
  } catch (error) {
    // Log the data that caused the error if possible (be careful with sensitive info)
    // console.error("Data causing error:", dataToSave); // For debugging
    console.error("Error creating order:", error);
    // Improve error message clarity
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create order: ${message}`);
  }
};
// --- Function to add notes LATER (can use serverTimestamp) ---
const addInternalNoteToOrder = async (
  orderId: string,
  note: Omit<InternalNote, "timestamp">
) => {
  if (!db) throw new Error("Firestore not initialized.");
  const orderRef = doc(db, "orders", orderId);

  // *** IMPORTANT: serverTimestamp CAN be used here in updateDoc ***
  const noteWithTimestamp: InternalNote = {
    ...note,
    timestamp: serverTimestamp() as Timestamp, // OK to use serverTimestamp with updateDoc/arrayUnion
  };

  try {
    // Use arrayUnion to add the new note
    await updateDoc(orderRef, {
      internalNotes: arrayUnion(noteWithTimestamp),
    });
    console.log(`Internal note added to order ${orderId}`);
  } catch (error) {
    console.error(`Error adding internal note to order ${orderId}:`, error);
    throw new Error("Failed to add internal note.");
  }
};

/**
 * Retrieves all orders from the 'orders' collection in Firestore.
 * @returns A promise that resolves to an array of Order objects, or an empty array on error.
 */
const getOrders = async (): Promise<Order[]> => {
  try {
    if (!db) {
      //
      throw new Error("Firestore database is not initialized."); //
    }
    const orderCol = collection(db, "orders"); //
    const orderSnapshot = await getDocs(orderCol); //
    return orderSnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData; //
      // Map Firestore data to the Order interface from data/order.ts
      return {
        id: doc.id,
        customerId: data.customerId || "",
        items: data.items || [],
        orderDate: data.orderDate?.toDate() ?? new Date(), // Convert Timestamp to Date
        totalAmount: data.totalAmount || 0,
        status: data.status || "pending",
        shippingAddress: data.shippingAddress || {
          governorate: "",
          city: "",
          landMark: "",
          fullAdress: "",
        },
        notes: data.notes || undefined,
        // === ADD THIS LINE to map internalNotes ===
        // Keep Timestamps as they are, matching the InternalNote interface
        internalNotes: (data.internalNotes || []) as InternalNote[],
        // If you needed JS Dates:
        // internalNotes: (data.internalNotes || []).map((note: any) => ({
        //     ...note,
        //     timestamp: note.timestamp?.toDate ? note.timestamp.toDate() : new Date() // Convert inner timestamp
        // })),
        // ========================================
      } as Order; // Assert the type
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

/**
 * Retrieves a single order from the 'orders' collection by its ID.
 * @param orderId - The ID of the order to retrieve.
 * @returns A promise that resolves to an Order object if found, or null if not found or on error.
 */
const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    if (!db) {
      //
      throw new Error("Firestore database is not initialized."); //
    }
    const orderDocRef = doc(db, "orders", orderId); //
    const orderDocSnap = await getDoc(orderDocRef); //

    if (orderDocSnap.exists()) {
      //
      const data = orderDocSnap.data() as DocumentData; //
      // Map Firestore data to the Order interface from data/order.ts
      return {
        id: orderDocSnap.id,
        customerId: data.customerId || "",
        items: data.items || [],
        orderDate: data.orderDate?.toDate() ?? new Date(), // Convert Timestamp to Date
        totalAmount: data.totalAmount || 0,
        status: data.status || "pending",
        shippingAddress: data.shippingAddress || {
          governorate: "",
          city: "",
          landMark: "",
          fullAdress: "",
        },
        notes: data.notes || undefined,
        // === ADD THIS LINE to map internalNotes ===
        // Keep Timestamps as they are, matching the InternalNote interface
        internalNotes: (data.internalNotes || []) as InternalNote[],
        // If you needed JS Dates:
        // internalNotes: (data.internalNotes || []).map((note: any) => ({
        //     ...note,
        //     timestamp: note.timestamp?.toDate ? note.timestamp.toDate() : new Date() // Convert inner timestamp
        // })),
        // ========================================
      } as Order; // Assert the type
    } else {
      console.log(`Order with ID ${orderId} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
};

// Export the functions
export { createOrder, getOrders, getOrderById, addInternalNoteToOrder };
