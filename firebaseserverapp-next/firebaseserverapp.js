// @ts-nocheck
// [START serverapp_auth]
import { initializeServerApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function MyServerComponent() {

    // Get relevant request headers (in Next.JS)
    const authIdToken = headers().get('Authorization')?.split('Bearer ')[1];

    // Initialize the FirebaseServerApp instance.
    const serverApp = initializeServerApp(firebaseConfig, { authIdToken });

    // Initialize Firebase Authentication using the FirebaseServerApp instance.
    const auth = getAuth(serverApp);

    if (auth.currentUser) {
        redirect('/profile');
    }

    // ...
}
// [END serverapp_auth]

const firebaseConfig = {};
