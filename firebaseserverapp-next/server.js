import { headers } from 'next/headers';
// @ts-expect-error this is not in the firebase js sdk yet
import { initializeServerApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { redirect } from 'next/navigation';

const config = {};

// [START server_client]
export default async function MyServerComponent({ params }) {

    // get relevant request headers (NextJS)
    const authIdToken = headers().get('Authorization')?.split('Bearer ')[1];

    // Initialize the Firebase server app instance
    const serverApp = initializeServerApp(config, { authIdToken });

    // Initialize the auth SDK
    const auth = getAuth(serverApp);

    if (auth.currentUser) {
        redirect('/profile');
    }

    // ...
}
// [END server_client]