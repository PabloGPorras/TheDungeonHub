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

  const handleCreateDungeon = () => {
    console.log("Create Dungeon clicked");
    // Logic to create a new dungeon will go here
  };

  const handleJoinDungeon = () => {
    console.log("Join Dungeon clicked");
    // Logic to join a dungeon will go here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold">Welcome to TheDungeonHub</h1>
      <p className="text-lg">Create or join a Dungeon to start playing.</p>
      <div className="flex space-x-4">
        <button
          onClick={handleCreateDungeon}
          className="bg-green-500 text-white px-6 py-2 rounded-lg"
        >
          Create Dungeon
        </button>
        <button
          onClick={handleJoinDungeon}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Join Dungeon
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-6 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;