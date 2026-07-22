import { db } from './firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { INITIAL_JOBS } from './jobService';

async function migrate() {
  console.log('Starting migration...');
  try {
    // Fetch all current jobs from root 'jobs' collection
    const snap = await getDocs(collection(db, 'jobs'));
    console.log(`Found ${snap.size} jobs in root 'jobs' collection.`);
    
    let count = 0;
    for (const d of snap.docs) {
      await setDoc(doc(db, 'users', 'aryan', 'jobs', d.id), d.data());
      count++;
    }
    console.log(`Migrated ${count} jobs from root 'jobs' to 'users/aryan/jobs'.`);

    // In case Firestore root jobs was empty or we want to guarantee INITIAL_JOBS are uploaded
    if (count === 0) {
      console.log('No jobs found in root. Populating users/aryan/jobs with INITIAL_JOBS...');
      for (const j of INITIAL_JOBS) {
        await setDoc(doc(db, 'users', 'aryan', 'jobs', j.id), j);
        count++;
      }
      console.log(`Populated ${count} INITIAL_JOBS under 'users/aryan/jobs'.`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
  console.log('Migration finished successfully!');
  process.exit(0);
}

migrate();
