import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth"; // Import User type
import { auth } from "./firebase/config";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  const [user, setUser] = useState<User | null>(null); // Explicitly type state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // No TypeScript error now
    });
    return () => unsubscribe();
  }, []);

  return user ? <Home /> : <Login />;
};

export default App;
