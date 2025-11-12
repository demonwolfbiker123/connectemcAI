import { BookOpen, MessageSquare, Brain, Users, ArrowRight, Star, Zap } from 'lucide-react';

type HomeProps = {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
};

export default function Home({ onGetStarted, isAuthenticated = false }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ConnectEMC AI</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {isAuthenticated ? 'Return to Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master EMC with
            <span className="text-blue-600"> AI-Powered</span>
            <br />Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your understanding of ConnectEMC with our intelligent AI learning platform.
            Get personalized guidance, instant answers, and comprehensive course materials.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isAuthenticated ? 'Return to Dashboard' : 'Start Learning Now'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
              <Brain className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Assistant</h3>
            <p className="text-gray-600 leading-relaxed">
              Chat with our intelligent AI assistant that understands EMC concepts and provides instant, accurate answers to your questions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
              <BookOpen className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Comprehensive Courses</h3>
            <p className="text-gray-600 leading-relaxed">
              Access structured courses covering all aspects of EMC, from fundamentals to advanced topics, curated by industry experts.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
              <MessageSquare className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive Learning</h3>
            <p className="text-gray-600 leading-relaxed">
              Engage in interactive conversations, save important content, and track your learning progress with personalized insights.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-white shadow-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Why Choose ConnectEMC AI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="flex flex-col items-center">
                <Zap className="w-12 h-12 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Instant Answers</h4>
                <p className="text-blue-100 text-sm">
                  Get immediate responses to complex EMC questions
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Expert Content</h4>
                <p className="text-blue-100 text-sm">
                  Learn from industry-validated materials
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Star className="w-12 h-12 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Personalized Path</h4>
                <p className="text-blue-100 text-sm">
                  Tailored learning experience for your goals
                </p>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 text-lg rounded-xl hover:bg-gray-50 transition shadow-lg font-semibold"
            >
              {isAuthenticated ? 'Return to Dashboard' : 'Join Now'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">ConnectEMC AI</span>
            </p>
            <p className="mt-2 text-sm">
              Your intelligent partner in mastering ConnectEMC Learning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
