import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where
} from 'firebase/firestore';
import { db } from './firebase';
import type { RecipeSubmission } from '../types';

const submissionCollection = collection(db, 'recipeSubmissions');

export const subscribeToSubmissions = (callback: (submissions: RecipeSubmission[]) => void) => {
  console.log("Subscribing to Firestore path: recipeSubmissions (top-level)");
  // Temporarily removing orderBy to see if missing createdAt is the issue
  const q = query(
    submissionCollection, 
    where('status', '==', 'new')
  );
  
  return onSnapshot(q, (snapshot) => {
    console.log(`Fetched ${snapshot.size} submissions from Firestore.`);
    const submissions = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Submission ID: ${doc.id}, Fields:`, Object.keys(data));
      console.log(`Status: ${data.status}, createdAt: ${data.createdAt}, timestamp: ${data.timestamp}`);
      return {
        ...data,
        id: doc.id,
      } as RecipeSubmission;
    });
    
    // Sort in memory to keep UI consistent
    const sortedSubmissions = [...submissions].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || a.timestamp || 0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || b.timestamp || 0);
      return dateB.getTime() - dateA.getTime();
    });

    callback(sortedSubmissions);
  }, (error) => {
    console.error("Error subscribing to submissions:", error);
  });
};

export const updateSubmissionStatus = async (submissionId: string, status: 'new' | 'reviewed') => {
  try {
    const submissionRef = doc(db, 'recipeSubmissions', submissionId);
    await updateDoc(submissionRef, { status });
  } catch (error) {
    console.error("Error updating submission status:", error);
    throw error;
  }
};
