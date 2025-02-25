import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { db } from "@/firebase/config"; // Firestore config
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Dungeon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ user: string; text: string; isMe: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]); // Store actual users in chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ uid: string; displayName: string } | null>(null);

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, displayName: user.displayName || "Anonymous" });

        // Add user to Firestore when they join the dungeon
        const userRef = doc(db, "dungeons", id!, "users", user.uid);
        setDoc(userRef, { name: user.displayName || "Anonymous" }, { merge: true });
      }
    });

    return () => unsubscribeAuth();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Firestore listener for real-time message updates
    const q = query(collection(db, "dungeons", id, "messages"), orderBy("timestamp"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            user: data.user,
            text: data.text,
            isMe: currentUser ? data.userId === currentUser.uid : false, // Compare user IDs
          };
        })
      );
    });

    // Firestore listener for real-time user updates
    const usersQuery = collection(db, "dungeons", id, "users");
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setUsersInRoom(snapshot.docs.map((doc) => doc.data().name));
    });

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [id, currentUser]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || !id || !currentUser) return;

    await addDoc(collection(db, "dungeons", id, "messages"), {
      userId: currentUser.uid,
      user: currentUser.displayName,
      text: input,
      timestamp: serverTimestamp(),
    });

    setInput(""); // Clear input after sending
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser && id) {
        await deleteDoc(doc(db, "dungeons", id, "users", currentUser.uid));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id, currentUser]);

  return (
    <div className="flex h-screen">
      {/* Sidebar with Players List */}
      <Collapsible open={isSidebarOpen} onOpenChange={setIsSidebarOpen} className="relative bg-gray-900 text-white p-4 w-64 shadow-md">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-4">
            ☰ Toggle Sidebar
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <h2 className="text-xl font-bold mb-4">Dungeon: {id}</h2>
          <Separator className="mb-4" />
          <h3 className="text-lg font-semibold mb-3">Players in Room:</h3>
          <ScrollArea className="h-64 space-y-3">
            {usersInRoom.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-md">
                <Avatar>
                  <AvatarFallback>{user.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user}</span>
              </div>
            ))}
          </ScrollArea>
          <Button className="mt-6 w-full bg-red-500" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Chat Section */}
      <div className="flex flex-col w-full p-6">
        <Card className="flex-1 p-4 overflow-y-auto">
          <ScrollArea className="h-[70vh] space-y-4 p-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                {msg.isMe ? (
                  <p className="p-3 rounded-md shadow-md bg-blue-500 text-white">{msg.text}</p>
                ) : (
                  <>
                    <Avatar className="mr-2">
                      <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="p-3 rounded-md shadow-md bg-gray-300 text-gray-900">{msg.text}</p>
                  </>
                )}
              </div>
            ))}
          </ScrollArea>
        </Card>

        {/* Message Input Field */}
        <div className="flex mt-4 items-center">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            placeholder="Type your message..."
          />
          <Button onClick={handleSendMessage} className="ml-3">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dungeon;
