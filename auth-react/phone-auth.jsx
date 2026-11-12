// [SNIPPET_REGISTRY disabled]
// [SNIPPETS_SEPARATION enabled]
// [SNIPPETS_SUFFIX _react]

function recaptchaVerifierInvisible() {
  function onSignInSubmit() {
    // TODO(you): Implement
  }

  // [START auth_phone_recaptcha_verifier_invisible]
  const { useRef } = require("react");
  const { getAuth, RecaptchaVerifier } = require("firebase/auth");

  function PhoneSignInForm() {
    const recaptchaVerifier = useRef(null);

    // React calls this with the element on mount and with the cleanup on unmount.
    function setupRecaptcha(container) {
      const auth = getAuth();
      recaptchaVerifier.current = new RecaptchaVerifier(auth, container, {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        }
      });
      return () => {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      };
    }

    return <button ref={setupRecaptcha} type="submit">Sign in</button>;
  }
  // [END auth_phone_recaptcha_verifier_invisible]
}

function recaptchaVerifierVisible() {
  // [START auth_phone_recaptcha_verifier_visible]
  const { useRef } = require("react");
  const { getAuth, RecaptchaVerifier } = require("firebase/auth");

  function PhoneSignInForm() {
    const recaptchaVerifier = useRef(null);

    // React calls this with the element on mount and with the cleanup on unmount.
    function setupRecaptcha(container) {
      const auth = getAuth();
      recaptchaVerifier.current = new RecaptchaVerifier(auth, container, {
        'size': 'normal',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      });
      return () => {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      };
    }

    return <div ref={setupRecaptcha} />;
  }
  // [END auth_phone_recaptcha_verifier_visible]
}

function recaptchaVerifierSimple() {
  // [START auth_phone_recaptcha_verifier_simple]
  const { useRef } = require("react");
  const { getAuth, RecaptchaVerifier } = require("firebase/auth");

  function PhoneSignInForm() {
    const recaptchaVerifier = useRef(null);

    // React calls this with the element on mount and with the cleanup on unmount.
    function setupRecaptcha(container) {
      const auth = getAuth();
      recaptchaVerifier.current = new RecaptchaVerifier(auth, container, {});
      return () => {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      };
    }

    return <div ref={setupRecaptcha} />;
  }
  // [END auth_phone_recaptcha_verifier_simple]
}

function recaptchaRender() {
  const { RecaptchaVerifier } = require("firebase/auth");

  /** @type {{ current: RecaptchaVerifier }} */
  const recaptchaVerifier = { current: null };
  /** @type {{ current: number }} */
  const recaptchaWidgetId = { current: null };

  // [START auth_phone_recaptcha_render]
  // Call render() in the ref callback, right after creating the verifier.
  recaptchaVerifier.current.render().then((widgetId) => {
    recaptchaWidgetId.current = widgetId;
  });
  // [END auth_phone_recaptcha_render]
}

function phoneSignIn() {
  // Defined in the snippets above and below.
  function setupRecaptcha(container) {
    return () => {};
  }
  function VerifyCodeForm({ confirmationResult }) {
    return null;
  }

  // [START auth_phone_signin]
  const { useRef, useState, useActionState } = require("react");
  const { getAuth, signInWithPhoneNumber } = require("firebase/auth");

  function PhoneSignInForm() {
    // Created by the setupRecaptcha ref callback shown above.
    const recaptchaVerifier = useRef(null);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const [error, signIn, isPending] = useActionState(async (previousError, formData) => {
      const phoneNumber = formData.get("phoneNumber");
      const appVerifier = recaptchaVerifier.current;

      const auth = getAuth();
      try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        setConfirmationResult(confirmationResult);
        // ...
        return null;
      } catch (error) {
        // Error; SMS not sent
        // ...
        return error.message;
      }
    }, null);

    return confirmationResult ? (
      <VerifyCodeForm confirmationResult={confirmationResult} />
    ) : (
      <form action={signIn}>
        <input name="phoneNumber" type="tel" />
        <button ref={setupRecaptcha} type="submit" disabled={isPending}>Sign in</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_phone_signin]
}

function verifyCode() {
  // [START auth_phone_verify_code]
  const { useActionState } = require("react");

  function VerifyCodeForm({ confirmationResult }) {
    const [error, verifyCode, isPending] = useActionState(async (previousError, formData) => {
      const code = formData.get("code");
      try {
        const result = await confirmationResult.confirm(code);
        // User signed in successfully.
        const user = result.user;
        // ...
        return null;
      } catch (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        return error.message;
      }
    }, null);

    return (
      <form action={verifyCode}>
        <input name="code" />
        <button type="submit" disabled={isPending}>Verify</button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }
  // [END auth_phone_verify_code]
}

function getRecaptchaResponse() {
  const recaptchaWidgetId = { current: "..." };
  const grecaptcha = {};

  // [START auth_get_recaptcha_response]
  const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId.current);
  // [END auth_get_recaptcha_response]
}
