import { useState, useEffect } from 'react';
import { supabase, Course } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, LogOut, MessageSquare, Save, Star, ChevronLeft, ArrowRight } from 'lucide-react';
import ChatBot from './ChatBot';
import SavedContentView from './SavedContentView';
import FeedbackForm from './FeedbackForm';

type ViewType = 'courses' | 'chat' | 'saved' | 'course-detail';

type Props = {
  onNavigateHome?: () => void;
};

export default function UserDashboard({ onNavigateHome }: Props) {
  const { signOut, profile } = useAuth();
  const [view, setView] = useState<ViewType>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course-detail');
  };

  const handleStartChat = () => {
    if (selectedCourse) {
      setView('chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200 py-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ConnectEMC AI
                </h1>
                <p className="text-xs text-gray-600 font-medium">Learning Platform</p>
              </div>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFeedback(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Star className="w-4 h-4" />
                Feedback
              </button>
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
        <div className="bg-white rounded-2xl shadow-lg border mb-6 overflow-hidden">
          <div className="flex border-b bg-gradient-to-r from-white to-blue-50/30">
            <button
              onClick={() => setView('courses')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                view === 'courses' || view === 'course-detail'
                  ? 'text-blue-600 border-b-3 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Courses
            </button>
            <button
              onClick={() => setView('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                view === 'chat'
                  ? 'text-blue-600 border-b-3 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              AI Assistant
            </button>
            <button
              onClick={() => setView('saved')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                view === 'saved'
                  ? 'text-blue-600 border-b-3 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Save className="w-5 h-5" />
              Saved Content
            </button>
          </div>

          <div className="p-6">
            {loading && view === 'courses' ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : (
              <>
                {view === 'courses' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Courses</h2>
                    <p className="text-gray-600 mb-8">Explore our comprehensive EMC learning materials</p>
                    {courses.length === 0 ? (
                      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border-2 border-dashed border-gray-300">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No courses available yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className="bg-gradient-to-br from-white to-blue-50/20 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                            onClick={() => handleSelectCourse(course)}
                          >
                            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                              <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
                              {course.content.substring(0, 120)}...
                            </p>
                            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                              <span>View Course</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {view === 'course-detail' && selectedCourse && (
                  <div>
                    <button
                      onClick={() => setView('courses')}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back to Courses
                    </button>
                    <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 mb-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h2>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(selectedCourse.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h3>
                        <div className="prose prose-blue max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                            {selectedCourse.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleStartChat}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                      >
                        <MessageSquare className="w-6 h-6" />
                        Start AI Chat
                      </button>
                      <button
                        onClick={() => setShowFeedback(true)}
                        className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold flex items-center gap-2"
                      >
                        <Star className="w-5 h-5" />
                        Give Feedback
                      </button>
                    </div>
                  </div>
                )}

                {view === 'chat' && (
                  <ChatBot
                    course={selectedCourse}
                    onSelectCourse={() => setView('courses')}
                  />
                )}

                {view === 'saved' && <SavedContentView />}
              </>
            )}
          </div>
        </div>
      </div>

      {showFeedback && (
        <FeedbackForm
          courseId={selectedCourse?.id}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
}
