import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface OrderData {
  orderId: string;
  userId?: string;
  userEmail?: string;
  planId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  recipientName: string;
  phone: string;
  address: string;
  detailAddress?: string;
  deliveryNote?: string;
  paymentMethod: 'card' | 'naver' | 'toss' | 'kakao' | 'transfer' | 'easy';
  status: 'pending' | 'preparing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
}

/**
 * Creates a real customer order in Firestore
 */
export async function createRealOrder(order: OrderData): Promise<OrderData> {
  const path = `orders/${order.orderId}`;
  try {
    const orderDocRef = doc(db, 'orders', order.orderId);
    await setDoc(orderDocRef, order);
    
    // Store in localStorage as local client backup for user's own reference
    try {
      const localOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
      localOrders.unshift(order);
      localStorage.setItem('my_orders', JSON.stringify(localOrders.slice(0, 20)));
    } catch {
      // ignore local storage errors
    }

    return order;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Gets a single order by its ID (for customer order tracking)
 */
export async function getOrderById(orderId: string): Promise<OrderData | null> {
  const cleanId = orderId.trim();
  const path = `orders/${cleanId}`;
  try {
    const orderDocRef = doc(db, 'orders', cleanId);
    const snap = await getDoc(orderDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as OrderData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Subscribes to real-time orders (for store owner / admin)
 */
export function subscribeToOrders(
  onOrders: (orders: OrderData[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders: OrderData[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as OrderData);
        });
        // Sort newest first
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onOrders(orders);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Updates order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderData['status']
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status: newStatus,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
