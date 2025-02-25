import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase/config";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dungeon from "./pages/Dungeon";


const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/dungeon/:id" element={<Dungeon />} />
            </>
        ) : (
          <Route path="/*" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
