import { useState, useEffect } from 'react';
import { supabase, SavedContent } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, BookOpen } from 'lucide-react';

export default function SavedContentView() {
  const { user } = useAuth();
  const [savedContent, setSavedContent] = useState<(SavedContent & { courses?: { title: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedContent();
  }, []);

  const loadSavedContent = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await supabase
        .from('saved_content')
        .select('*, courses(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setSavedContent(data || []);
    } catch (error) {
      console.error('Error loading saved content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved content?')) return;

    try {
      const { error } = await supabase.from('saved_content').delete().eq('id', id);
      if (error) throw error;
      setSavedContent(savedContent.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting saved content:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading saved content...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Content</h2>

      {savedContent.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No saved content yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Save AI responses from the chat to view them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedContent.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      {(item.courses as any)?.title || 'Unknown Course'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Saved on {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
