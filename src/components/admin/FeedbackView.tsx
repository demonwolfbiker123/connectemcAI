import { Feedback } from '../../lib/supabase';
import { Star } from 'lucide-react';

type Props = {
  feedback: (Feedback & { profiles?: { email: string } })[];
};

export default function FeedbackView({ feedback }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Feedback</h2>

      {feedback.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No feedback yet.</p>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {(item.profiles as any)?.email || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < item.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
