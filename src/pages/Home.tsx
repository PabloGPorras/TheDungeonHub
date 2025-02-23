import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const Home = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to TheDungeonHub</h1>
      <p className="text-lg mb-6">Create or join a Dungeon to start playing.</p>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-6 py-2 rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Home;