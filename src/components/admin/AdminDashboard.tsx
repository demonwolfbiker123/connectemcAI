import { useState, useEffect } from 'react';
import { supabase, Course, Feedback, ChatMessage, Profile } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, MessageSquare, Users, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import CourseForm from './CourseForm';
import FeedbackView from './FeedbackView';
import ChatHistoryView from './ChatHistoryView';

type TabType = 'courses' | 'feedback' | 'chat';

export default function AdminDashboard() {
  const { signOut, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'courses') {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });
        setCourses(data || []);
      } else if (activeTab === 'feedback') {
        const { data } = await supabase
          .from('feedback')
          .select('*, profiles(email)')
          .order('created_at', { ascending: false });
        setFeedback(data || []);
      } else if (activeTab === 'chat') {
        const { data: chats } = await supabase
          .from('chat_history')
          .select('*, profiles(email), courses(title)')
          .order('created_at', { ascending: false });
        setChatHistory(chats || []);

        const { data: usersList } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'user');
        setUsers(usersList || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleSaveCourse = async () => {
    setShowCourseForm(false);
    setEditingCourse(null);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center gap-3 py-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl blur-sm"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ConnectEMC AI
                </h1>
                <p className="text-xs text-gray-600 font-medium">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{profile?.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'courses'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'feedback'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Feedback
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              Chat History
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'courses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
                      <button
                        onClick={() => setShowCourseForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Plus className="w-5 h-5" />
                        Add Course
                      </button>
                    </div>

                    {showCourseForm || editingCourse ? (
                      <CourseForm
                        course={editingCourse}
                        onSave={handleSaveCourse}
                        onCancel={() => {
                          setShowCourseForm(false);
                          setEditingCourse(null);
                        }}
                      />
                    ) : (
                      <div className="space-y-4">
                        {courses.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">No courses yet. Add your first course!</p>
                        ) : (
                          courses.map((course) => (
                            <div
                              key={course.id}
                              className="border rounded-lg p-6 hover:shadow-md transition"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {course.title}
                                  </h3>
                                  <p className="text-gray-600 line-clamp-3">{course.content}</p>
                                  <p className="text-sm text-gray-400 mt-2">
                                    Created {new Date(course.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => setEditingCourse(course)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  >
                                    <Edit2 className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'feedback' && <FeedbackView feedback={feedback} />}
                {activeTab === 'chat' && <ChatHistoryView chatHistory={chatHistory} users={users} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
