import { useState, useEffect, useRef } from 'react';
import { supabase, Course } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { getChatCompletion } from '../../lib/openai';
import { Send, BookOpen, Save, Loader } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Props = {
  course: Course | null;
  onSelectCourse: () => void;
};

export default function ChatBot({ course, onSelectCourse }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (course) {
      loadChatHistory();
    }
  }, [course]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!course || !user) return;

    try {
      const { data } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .order('created_at', { ascending: true });

      if (data) {
        const loadedMessages: Message[] = [];
        data.forEach((chat) => {
          loadedMessages.push({
            id: `${chat.id}-user`,
            role: 'user',
            content: chat.message,
            timestamp: new Date(chat.created_at),
          });
          loadedMessages.push({
            id: `${chat.id}-assistant`,
            role: 'assistant',
            content: chat.response,
            timestamp: new Date(chat.created_at),
          });
        });
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !course || !user || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `You are an AI teaching assistant for the course "${course.title}". Use the following course content as your knowledge base to answer student questions. Be helpful, clear, and educational.

Course Content:
${course.content}

Only answer questions related to this course content. If a question is outside the scope, politely redirect the student to the course material.`;

      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: input },
      ];

      const response = await getChatCompletion(chatMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from('chat_history').insert([{
        user_id: user.id,
        course_id: course.id,
        message: input,
        response: response,
        role: 'user',
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (content: string) => {
    if (!user || !course) return;

    try {
      await supabase.from('saved_content').insert([{
        user_id: user.id,
        course_id: course.id,
        content: content,
        title: `Saved from ${course.title}`,
      }]);

      setSavedMessage('Content saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Course Selected</h3>
        <p className="text-gray-600 mb-6">Please select a course to start chatting with the AI assistant.</p>
        <button
          onClick={onSelectCourse}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
          <p className="text-sm text-gray-600">AI Teaching Assistant</p>
        </div>
        <button
          onClick={onSelectCourse}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          Change Course
        </button>
      </div>

      {savedMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {savedMessage}
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ask me anything about this course!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleSaveContent(message.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition"
                  >
                    <Save className="w-3 h-3" />
                    Save this response
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <Loader className="w-5 h-5 text-gray-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question about the course..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
