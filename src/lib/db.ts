import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  type QueryConstraint,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const subscribeToCollection = <T>(
  path: string, 
  callback: (data: T[]) => void, 
  constraints: QueryConstraint[] = []
) => {
  const q = query(collection(db, path), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const createDocument = async (path: string, data: any) => {
  try {
    return await addDoc(collection(db, path), {
      ...data,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateDocument = async (path: string, id: string, data: any) => {
  try {
    const docRef = doc(db, path, id);
    return await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
};

export const deleteDocument = async (path: string, id: string) => {
  try {
    const docRef = doc(db, path, id);
    return await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
  }
};

export const logSecurityEvent = async (type: string, message: string, severity: string, metadata?: any) => {
  try {
    await addDoc(collection(db, 'log_events'), {
      type,
      message,
      severity,
      metadata: metadata || {},
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log security event', error);
  }
};
