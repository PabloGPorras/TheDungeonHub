import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { db } from "@/firebase/config"; // Import Firestore configuration
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Dungeon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ user: string; text: string; isMe: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [usersInRoom] = useState<string[]>(["Player1", "Player2"]); // Example: Players in chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Firestore query for real-time message updates
    const q = query(collection(db, "dungeons", id, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          user: doc.data().user,
          text: doc.data().text,
          isMe: doc.data().user === "You", // Change this to track real users
        }))
      );
    });

    return () => unsubscribe();
  }, [id]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || !id) return;
  
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to send messages.");
      return;
    }
  
    await addDoc(collection(db, "dungeons", id, "messages"), {
      userId: user.uid, // Store the user ID for future tracking
      user: user.displayName || "Anonymous", // Get the actual user name
      text: input,
      timestamp: serverTimestamp(),
    });
  
    setInput(""); // Clear input after sending
  };

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
                {!msg.isMe && (
                  <Avatar className="mr-2">
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <p
                  className={`p-3 rounded-md shadow-md ${
                    msg.isMe ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"
                  }`}
                >
                  {msg.text}
                </p>
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
