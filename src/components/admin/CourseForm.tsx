import { useState, useEffect } from 'react';
import { supabase, Course } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Save, X } from 'lucide-react';

type Props = {
  course: Course | null;
  onSave: () => void;
  onCancel: () => void;
};

export default function CourseForm({ course, onSave, onCancel }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setContent(course.content);
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (course) {
        const { error: updateError } = await supabase
          .from('courses')
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq('id', course.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('courses')
          .insert([{ title, content, created_by: user?.id }]);

        if (insertError) throw insertError;
      }
      onSave();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 border">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {course ? 'Edit Course' : 'Add New Course'}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="e.g., Introduction to Machine Learning"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Course Content (Knowledge Base)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            placeholder="Enter comprehensive course content that will be used as the knowledge base for the AI assistant..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This content will be used by the AI chatbot to answer student questions.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Course'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
