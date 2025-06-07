// components/MessageItem.js
export default function MessageItem({ message, onReply }) {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <img
          src={message.sender.profilePhoto || "/avatar.png"}
          alt={message.sender.name}
          className="mr-3 h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <span className="mr-2 font-semibold">{message.sender.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-1">{message.content}</p>

          {message.replies && message.replies.length > 0 && (
            <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-2">
              {message.replies.map((reply) => (
                <MessageItem key={reply.id} message={reply} />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onReply}
          className="text-sm text-blue-600 hover:underline"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
