// components/ChatContainer.js
export default function ChatContainer({ chat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      // API call to send message
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          content: newMessage,
          sender: currentUser,
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">{chat.name || "Private Chat"}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onReply={() => setReplyingTo(msg)}
          />
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-l border p-2"
          />
          <button
            onClick={sendMessage}
            className="rounded-r bg-blue-600 px-4 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

