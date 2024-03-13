// @ts-nocheck
// [START serverapp_auth]
import { initializeServerApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function MyServerComponent() {

    // get relevant request headers (NextJS)
    const authIdToken = headers().get('Authorization')?.split('Bearer ')[1];

    // Initialize the Firebase server app instance
    const serverApp = initializeServerApp(firebaseConfig, { authIdToken });

    // Initialize the auth SDK
    const auth = getAuth(serverApp);

    if (auth.currentUser) {
        redirect('/profile');
    }

    // ...
}
// [END serverapp_auth]

const firebaseConfig = {};
