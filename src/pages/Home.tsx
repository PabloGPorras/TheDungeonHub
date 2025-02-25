import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCreateDungeon = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "dungeons"), {
        createdAt: new Date(),
        users: [],
      });
      console.log("Dungeon created with ID: ", docRef.id);
      navigate(`/dungeon/${docRef.id}`);
    } catch (error) {
      console.error("Error creating dungeon: ", error);
      alert("Failed to create dungeon. Please try again.");
    }
    setLoading(false);
  };

  const handleJoinDungeon = () => {
    const dungeonId = prompt("Enter Dungeon ID:");
    if (dungeonId) navigate(`/dungeon/${dungeonId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold">Welcome to TheDungeonHub</h1>
      <p className="text-lg">Create or join a Dungeon to start playing.</p>
      <div className="flex space-x-4">
        <button
          onClick={handleCreateDungeon}
          className="bg-green-500 text-white px-6 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Dungeon"}
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