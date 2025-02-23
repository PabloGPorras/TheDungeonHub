import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

const Login = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to TheDungeonHub</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;