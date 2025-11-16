// firebaseAPI.ts
// Firebase Database Functions - Optimized for Google AI Studio
// Heritage Grand Event Management System

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { Booking, Expense, Package, ServiceConfig, ExpenseCategory, Vendor } from './types';

// ============================================
// BOOKINGS API
// ============================================

export const bookingsAPI = {
  // Get all bookings
  async getAll(): Promise<Booking[]> {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      return snapshot.docs.map(doc => ({
        ...doc.data() as Omit<Booking, 'firestoreId'>,
        firestoreId: doc.id
      } as Booking));
    } catch (error) {
      console.error('❌ Error getting bookings:', error);
      return [];
    }
  },

  // Add new booking
  async add(booking: Booking): Promise<boolean> {
    try {
      // Remove firestoreId if it exists, as Firestore will generate it
      const { firestoreId, ...bookingData } = booking as any;
      await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        createdAt: Timestamp.now()
      });
      console.log('✅ Booking added:', booking.bookingId);
      return true;
    } catch (error) {
      console.error('❌ Error adding booking:', error);
      return false;
    }
  },

  // Update booking
  async update(bookingId: string, updates: Partial<Booking>): Promise<boolean> {
    try {
      const q = query(collection(db, 'bookings'), where('bookingId', '==', bookingId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.error('❌ Booking not found:', bookingId);
        return false;
      }

      const docRef = snapshot.docs[0].ref;
      // Remove firestoreId if it exists in updates
      const { firestoreId, ...updateData } = updates as any;
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: Timestamp.now()
      });
      console.log('✅ Booking updated:', bookingId);
      return true;
    } catch (error) {
      console.error('❌ Error updating booking:', error);
      return false;
    }
  },

  // Delete booking
  async delete(bookingId: string): Promise<boolean> {
    try {
      const q = query(collection(db, 'bookings'), where('bookingId', '==', bookingId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return false;

      await deleteDoc(snapshot.docs[0].ref);
      console.log('✅ Booking deleted:', bookingId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting booking:', error);
      return false;
    }
  }
};

// ============================================
// EXPENSES API
// ============================================

export const expensesAPI = {
  // Get all expenses
  async getAll(): Promise<Expense[]> {
    try {
      const snapshot = await getDocs(collection(db, 'expenses'));
      return snapshot.docs.map(doc => ({
        ...doc.data() as Omit<Expense, 'firestoreId'>,
        firestoreId: doc.id
      } as Expense));
    } catch (error) {
      console.error('❌ Error getting expenses:', error);
      return [];
    }
  },

  // Add new expense
  async add(expense: Expense): Promise<boolean> {
    try {
      const { firestoreId, ...expenseData } = expense as any;
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdAt: Timestamp.now()
      });
      console.log('✅ Expense added');
      return true;
    } catch (error) {
      console.error('❌ Error adding expense:', error);
      return false;
    }
  }
};

// ============================================
// PACKAGES API
// ============================================

export const packagesAPI = {
  // Get all packages
  async getAll(): Promise<Package[]> {
    try {
      const snapshot = await getDocs(collection(db, 'packages'));
      return snapshot.docs.map(doc => ({
        ...doc.data() as Omit<Package, 'firestoreId'>,
        firestoreId: doc.id
      } as Package));
    } catch (error) {
      console.error('❌ Error getting packages:', error);
      return [];
    }
  },

  // Add package
  async add(pkg: Package): Promise<boolean> {
    try {
      const { firestoreId, ...packageData } = pkg as any;
      await addDoc(collection(db, 'packages'), packageData);
      console.log('✅ Package added:', pkg.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding package:', error);
      return false;
    }
  },

  // Update package
  async update(packageId: string, updates: Partial<Package>): Promise<boolean> {
    try {
      const q = query(collection(db, 'packages'), where('id', '==', packageId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return false;

      const { firestoreId, ...updateData } = updates as any;
      await updateDoc(snapshot.docs[0].ref, updateData);
      console.log('✅ Package updated');
      return true;
    } catch (error) {
      console.error('❌ Error updating package:', error);
      return false;
    }
  }
};

// ============================================
// SERVICES CONFIG API
// ============================================

export const servicesConfigAPI = {
  // Get services config
  async get(): Promise<ServiceConfig | null> {
    try {
      const docRef = doc(db, 'config', 'services');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as ServiceConfig;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting services config:', error);
      return null;
    }
  },

  // Save services config
  async save(config: ServiceConfig): Promise<boolean> {
    try {
      const docRef = doc(db, 'config', 'services');
      await setDoc(docRef, config);
      console.log('✅ Services config saved');
      return true;
    } catch (error) {
      console.error('❌ Error saving services config:', error);
      return false;
    }
  }
};

// ============================================
// EXPENSE CATEGORIES API
// ============================================

export const expenseCategoriesAPI = {
  // Get all categories
  async getAll(): Promise<ExpenseCategory[]> {
    try {
      const snapshot = await getDocs(collection(db, 'expenseCategories'));
      return snapshot.docs.map(doc => ({
        ...doc.data() as Omit<ExpenseCategory, 'firestoreId'>,
        firestoreId: doc.id
      } as ExpenseCategory));
    } catch (error) {
      console.error('❌ Error getting expense categories:', error);
      return [];
    }
  },

  // Add category
  async add(category: ExpenseCategory): Promise<boolean> {
    try {
      const { firestoreId, ...categoryData } = category as any;
      await addDoc(collection(db, 'expenseCategories'), categoryData);
      console.log('✅ Category added:', category.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding category:', error);
      return false;
    }
  }
};

// ============================================
// VENDORS API
// ============================================

export const vendorsAPI = {
  // Get all vendors
  async getAll(): Promise<Vendor[]> {
    try {
      const snapshot = await getDocs(collection(db, 'vendors'));
      return snapshot.docs.map(doc => ({
        ...doc.data() as Omit<Vendor, 'firestoreId'>,
        firestoreId: doc.id
      } as Vendor));
    } catch (error) {
      console.error('❌ Error getting vendors:', error);
      return [];
    }
  },

  // Add vendor
  async add(vendor: Vendor): Promise<boolean> {
    try {
      const { firestoreId, ...vendorData } = vendor as any;
      await addDoc(collection(db, 'vendors'), vendorData);
      console.log('✅ Vendor added:', vendor.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding vendor:', error);
      return false;
    }
  }
};

// ============================================
// DATABASE INITIALIZATION
// ============================================

export const initializeDatabase = async (
  sampleBookings: Booking[],
  sampleExpenses: Expense[],
  defaultPackages: Package[],
  defaultServicesConfig: ServiceConfig,
  defaultCategories: ExpenseCategory[],
  defaultVendors: Vendor[]
) => {
  try {
    console.log('🔄 Initializing Firebase database...');

    // Add all sample data
    for (const booking of sampleBookings) {
      await bookingsAPI.add(booking);
    }

    for (const expense of sampleExpenses) {
      await expensesAPI.add(expense);
    }

    for (const pkg of defaultPackages) {
      await packagesAPI.add(pkg);
    }

    await servicesConfigAPI.save(defaultServicesConfig);

    for (const category of defaultCategories) {
      await expenseCategoriesAPI.add(category);
    }

    for (const vendor of defaultVendors) {
      await vendorsAPI.add(vendor);
    }

    console.log('✅ Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

// Export all APIs
export default {
  bookings: bookingsAPI,
  expenses: expensesAPI,
  packages: packagesAPI,
  servicesConfig: servicesConfigAPI,
  expenseCategories: expenseCategoriesAPI,
  vendors: vendorsAPI,
  initializeDatabase
};