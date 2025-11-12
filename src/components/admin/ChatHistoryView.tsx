import { useState } from 'react';
import { ChatMessage, Profile } from '../../lib/supabase';
import { User, BookOpen } from 'lucide-react';

type Props = {
  chatHistory: (ChatMessage & { profiles?: { email: string }; courses?: { title: string } })[];
  users: Profile[];
};

export default function ChatHistoryView({ chatHistory, users }: Props) {
  const [selectedUser, setSelectedUser] = useState<string>('all');

  const filteredHistory = selectedUser === 'all'
    ? chatHistory
    : chatHistory.filter((chat) => chat.user_id === selectedUser);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chat History</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="userFilter" className="text-sm font-medium text-gray-700">
            Filter by user:
          </label>
          <select
            id="userFilter"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No chat history yet.</p>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((chat) => (
            <div key={chat.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{(chat.profiles as any)?.email || 'Unknown User'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{(chat.courses as any)?.title || 'Unknown Course'}</span>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  {new Date(chat.created_at).toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-900 mb-1">Student Question:</p>
                  <p className="text-gray-800">{chat.message}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-900 mb-1">AI Response:</p>
                  <p className="text-gray-800">{chat.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
