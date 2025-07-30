// src/services/customerService.ts

import { db } from "../lib/firebase";
import {
  getDocs,
  doc,
  getDoc,
  setDoc, // Import setDoc to explicitly set the document ID
  collection,
  query, // Import query
  where, // Import where for querying
  limit, // Import limit for efficiency
  DocumentData,
  // addDoc, // Remove addDoc as we'll use setDoc with phone number as ID
} from "firebase/firestore";
import { Customer } from "../data/customer"; //
import { formatPhoneNumber } from "../lib/utils"; // Assuming formatPhoneNumber is in utils

/**
 * Retrieves a single customer from the 'customers' collection by their phone number.
 * Phone number MUST be formatted (e.g., English numerals, no spaces/prefix) before calling this function.
 * @param formattedPhone - The formatted phone number of the customer to retrieve.
 * @returns A promise that resolves to a Customer object if found, or null if not found or on error.
 */
const getCustomerByPhone = async (
  formattedPhone: string
): Promise<Customer | null> => {
  // Basic validation - ensure phone number is provided
  if (!formattedPhone) {
    console.error("getCustomerByPhone: Formatted phone number is required.");
    return null;
  }
  try {
    if (!db) {
      //
      throw new Error("Firestore database is not initialized."); //
    }
    const customerCollectionRef = collection(db, "customers");
    // Query for documents where the 'phone' field matches the formatted phone number
    // Note: This assumes you store the formatted phone number in the 'phone' field.
    // If you decide to use the phone number as the document ID, you'd use getCustomerById(formattedPhone) instead.
    // Let's stick to querying the 'phone' field for now as it's more flexible if formatting changes.
    const q = query(
      customerCollectionRef,
      where("phone", "==", formattedPhone),
      limit(1) // We only expect one customer per phone number
    );

    const querySnapshot = await getDocs(q); //

    if (!querySnapshot.empty) {
      const customerDocSnap = querySnapshot.docs[0];
      const data = customerDocSnap.data() as DocumentData; //
      // Map Firestore data to the full Customer interface
      return {
        id: customerDocSnap.id, // Use Firestore's document ID
        fullName: data.fullName || "N/A", //
        email: data.email || undefined, //
        phone: data.phone || "N/A", // // Should match formattedPhone
        secondPhone: data.secondPhone || undefined, //
        address: {
          governorate: data.address?.governorate || "N/A", //
          city: data.address?.city || "N/A", //
          landMark: data.address?.landMark || "", //
          fullAdress: data.address?.fullAdress || "N/A", //
        },
      } as Customer; //
    } else {
      console.log(`Customer with phone ${formattedPhone} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer by phone:", error);
    return null; // Return null on error
  }
};

/**
 * Creates a new customer document in the 'customers' collection using the formatted phone number as the document ID.
 * It first checks if a customer with this phone number already exists.
 * If the customer exists, it returns the existing customer's ID (phone number).
 * If not, it creates the new customer.
 * @param customerData - An object containing the customer details (phone number MUST be pre-formatted).
 * @returns A promise that resolves to the customer's ID (the formatted phone number).
 * @throws Throws an error if the document creation fails or Firestore is not initialized.
 */
const findOrCreateCustomer = async (
  customerData: Omit<Customer, "id"> // Expect data without an 'id'
): Promise<string> => {
  if (!db) {
    //
    throw new Error("Firestore database is not initialized."); //
  }

  // Ensure the phone number is provided and formatted
  const formattedPhone = customerData.phone; // Assume phone is already formatted by calling code
  if (!formattedPhone) {
    throw new Error(
      "Formatted phone number is required to find or create a customer."
    );
  }

  try {
    // Option 1: Check using getCustomerByPhone (queries the 'phone' field)
    // const existingCustomer = await getCustomerByPhone(formattedPhone);
    // if (existingCustomer) {
    //   console.log(`Customer with phone ${formattedPhone} already exists. ID: ${existingCustomer.id}`);
    //   return existingCustomer.id; // Return existing Firestore document ID
    // }

    // Option 2: Check directly by trying to get the document using the phone number as ID
    const customerDocRef = doc(db, "customers", formattedPhone); // Use phone as ID
    const customerDocSnap = await getDoc(customerDocRef); //

    if (customerDocSnap.exists()) {
      //
      console.log(`Customer with ID (phone) ${formattedPhone} already exists.`);
      return customerDocSnap.id; // Return the existing ID (which is the phone number)
    }

    // If customer doesn't exist, create them using the phone number as the document ID
    console.log(
      `Customer with ID (phone) ${formattedPhone} not found. Creating new customer.`
    );
    const dataToSave = {
      fullName: customerData.fullName, //
      email: customerData.email || null, //
      phone: formattedPhone, // Store the formatted phone number //
      secondPhone: customerData.secondPhone || null, //
      address: {
        //
        governorate: customerData.address.governorate, //
        city: customerData.address.city, //
        landMark: customerData.address.landMark || "", //
        fullAdress: customerData.address.fullAdress, //
      },
      // createdAt: serverTimestamp(), // Optional: Add creation timestamp
    };

    // Use setDoc to create a document with a specific ID (the phone number)
    await setDoc(customerDocRef, dataToSave);
    console.log("Customer created with ID (phone):", formattedPhone);
    return formattedPhone; // Return the phone number as the ID
  } catch (error) {
    console.error("Error finding or creating customer:", error);
    throw new Error(
      `Failed to find or create customer: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// --- Keep getCustomers and getCustomerById as they are, or adapt if needed ---
// getCustomerById will now work by passing the formatted phone number as the ID

const getCustomers = async (): Promise<Customer[]> => {
  // ... (implementation remains largely the same, ensure data mapping is correct)
  try {
    // Ensure db is initialized before proceeding
    if (!db) {
      //
      throw new Error("Firestore database is not initialized."); //
    }
    const customerCol = collection(db, "customers"); //
    const customerSnapshot = await getDocs(customerCol); //
    return customerSnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData; //
      // Map Firestore data to the full Customer interface
      return {
        id: doc.id, // The ID is the formatted phone number
        fullName: data.fullName || "N/A", //
        email: data.email || undefined, //
        phone: data.phone || "N/A", // // Should match the ID
        secondPhone: data.secondPhone || undefined, //
        address: {
          //
          governorate: data.address?.governorate || "N/A", //
          city: data.address?.city || "N/A", //
          landMark: data.address?.landMark || "", //
          fullAdress: data.address?.fullAdress || "N/A", //
        },
      } as Customer; //
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return []; // Return empty array on error
  }
};

const getCustomerById = async (
  // This now accepts the formatted phone number as ID
  customerId: string // customerId is the formatted phone number
): Promise<Customer | null> => {
  try {
    // Ensure db is initialized
    if (!db) {
      //
      throw new Error("Firestore database is not initialized."); //
    }
    // The customerId is the phone number, which we use as the document ID
    const customerDocRef = doc(db, "customers", customerId); //
    const customerDocSnap = await getDoc(customerDocRef); //

    if (customerDocSnap.exists()) {
      //
      const data = customerDocSnap.data() as DocumentData; //
      // Map Firestore data to the full Customer interface
      return {
        id: customerDocSnap.id, // ID is the phone number
        fullName: data.fullName || "N/A", //
        email: data.email || undefined, //
        phone: data.phone || "N/A", // // Should match ID
        secondPhone: data.secondPhone || undefined, //
        address: {
          //
          governorate: data.address?.governorate || "N/A", //
          city: data.address?.city || "N/A", //
          landMark: data.address?.landMark || "", //
          fullAdress: data.address?.fullAdress || "N/A", //
        },
      } as Customer; //
    } else {
      console.log(`Customer with ID (phone) ${customerId} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer by ID (phone):", error);
    return null; // Return null on error
  }
};

// Export the modified and new functions
export {
  findOrCreateCustomer,
  getCustomers,
  getCustomerById,
  getCustomerByPhone,
}; // Export getCustomerByPhone if needed elsewhere
