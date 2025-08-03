import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Clock, Send, Filter, ArrowUpDown } from 'lucide-react';

interface PeerReview {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  timestamp: string;
  helpful: number;
  suggestions: string[];
  codeQuality: number;
  efficiency: number;
  readability: number;
  isHelpful?: boolean;
}

interface Solution {
  id: string;
  author: string;
  problem: string;
  language: string;
  code: string;
  timestamp: string;
  likes: number;
  reviews: PeerReview[];
  tags: string[];
}

interface PeerReviewSystemProps {
  solutionId?: string;
  showSubmissionForm?: boolean;
  onSubmitReview?: (review: Omit<PeerReview, 'id' | 'timestamp' | 'helpful'>) => void;
}

const PeerReviewSystem: React.FC<PeerReviewSystemProps> = ({
  solutionId,
  showSubmissionForm = false,
  onSubmitReview
}) => {
  const [reviews, setReviews] = useState<PeerReview[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(showSubmissionForm);
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'helpful'>('helpful');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    codeQuality: 5,
    efficiency: 5,
    readability: 5,
    suggestions: ['']
  });

  useEffect(() => {
    loadData();
  }, [solutionId]);

  const loadData = async () => {
    setLoading(true);

    // Mock data - replace with actual API calls
    const mockSolutions: Solution[] = [
      {
        id: 'sol-1',
        author: 'CodeMaster123',
        problem: 'Two Sum',
        language: 'JavaScript',
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
        timestamp: '2024-01-15T10:30:00Z',
        likes: 24,
        reviews: [],
        tags: ['Hash Table', 'Array', 'Optimal']
      },
      {
        id: 'sol-2',
        author: 'AlgoExpert',
        problem: 'Valid Parentheses',
        language: 'Python',
        code: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    
    return not stack`,
        timestamp: '2024-01-14T15:45:00Z',
        likes: 18,
        reviews: [],
        tags: ['Stack', 'String', 'Clean Code']
      }
    ];

    const mockReviews: PeerReview[] = [
      {
        id: 1,
        reviewer: 'TechReviewer',
        rating: 4,
        comment: 'Great solution! The hash map approach is optimal with O(n) time complexity. The code is clean and well-structured.',
        timestamp: '2024-01-15T11:00:00Z',
        helpful: 12,
        suggestions: ['Consider adding input validation', 'Maybe add comments for clarity'],
        codeQuality: 4,
        efficiency: 5,
        readability: 4
      },
      {
        id: 2,
        reviewer: 'CodeCritic',
        rating: 5,
        comment: 'Perfect implementation! This is exactly how I would solve it. The variable names are descriptive and the logic is easy to follow.',
        timestamp: '2024-01-15T12:30:00Z',
        helpful: 8,
        suggestions: ['Excellent work!'],
        codeQuality: 5,
        efficiency: 5,
        readability: 5
      },
      {
        id: 3,
        reviewer: 'NewbieCoder',
        rating: 3,
        comment: 'Good solution but could use more comments. As a beginner, it took me a while to understand the logic.',
        timestamp: '2024-01-15T14:15:00Z',
        helpful: 5,
        suggestions: ['Add more comments', 'Maybe include a step-by-step explanation'],
        codeQuality: 4,
        efficiency: 5,
        readability: 2
      }
    ];

    setSolutions(mockSolutions);
    setReviews(mockReviews);

    if (solutionId) {
      const solution = mockSolutions.find(s => s.id === solutionId);
      setSelectedSolution(solution || null);
    }

    setLoading(false);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const filteredReviews = filterRating
    ? sortedReviews.filter(review => review.rating === filterRating)
    : sortedReviews;

  const handleSubmitReview = () => {
    const review: PeerReview = {
      id: Date.now(),
      reviewer: 'CurrentUser', // Replace with actual user
      rating: newReview.rating,
      comment: newReview.comment,
      timestamp: new Date().toISOString(),
      helpful: 0,
      suggestions: newReview.suggestions.filter(s => s.trim() !== ''),
      codeQuality: newReview.codeQuality,
      efficiency: newReview.efficiency,
      readability: newReview.readability
    };

    setReviews(prev => [review, ...prev]);

    if (onSubmitReview) {
      onSubmitReview({
        reviewer: review.reviewer,
        rating: review.rating,
        comment: review.comment,
        suggestions: review.suggestions,
        codeQuality: review.codeQuality,
        efficiency: review.efficiency,
        readability: review.readability
      });
    }

    // Reset form
    setNewReview({
      rating: 5,
      comment: '',
      codeQuality: 5,
      efficiency: 5,
      readability: 5,
      suggestions: ['']
    });
    setShowReviewForm(false);
  };

  const markHelpful = (reviewId: number, helpful: boolean) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, helpful: helpful ? review.helpful + 1 : Math.max(0, review.helpful - 1), isHelpful: helpful }
        : review
    ));
  };

  const StarRating: React.FC<{ rating: number; onChange?: (rating: number) => void; readonly?: boolean }> = ({
    rating,
    onChange,
    readonly = false
  }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Peer Reviews</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {reviews.length} reviews
            </span>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write Review</span>
          </button>
        </div>

        {/* Filters and Sorting */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="helpful">Most Helpful</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>

          <div className="space-y-4">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
              <StarRating
                rating={newReview.rating}
                onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
              />
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code Quality</label>
                <StarRating
                  rating={newReview.codeQuality}
                  onChange={(rating) => setNewReview(prev => ({ ...prev, codeQuality: rating }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Efficiency</label>
                <StarRating
                  rating={newReview.efficiency}
                  onChange={(rating) => setNewReview(prev => ({ ...prev, efficiency: rating }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Readability</label>
                <StarRating
                  rating={newReview.readability}
                  onChange={(rating) => setNewReview(prev => ({ ...prev, readability: rating }))}
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your thoughts about this solution..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions for Improvement</label>
              {newReview.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={suggestion}
                    onChange={(e) => {
                      const newSuggestions = [...newReview.suggestions];
                      newSuggestions[index] = e.target.value;
                      setNewReview(prev => ({ ...prev, suggestions: newSuggestions }));
                    }}
                    placeholder="Enter a suggestion..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {index === newReview.suggestions.length - 1 && (
                    <button
                      onClick={() => setNewReview(prev => ({ ...prev, suggestions: [...prev.suggestions, ''] }))}
                      className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!newReview.comment.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="p-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
            <p className="text-gray-600">Be the first to review this solution!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map(review => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {review.reviewer.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{review.reviewer}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <StarRating rating={review.rating} readonly />
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                </div>

                <p className="text-gray-900 mb-4">{review.comment}</p>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Code Quality</div>
                    <StarRating rating={review.codeQuality} readonly />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Efficiency</div>
                    <StarRating rating={review.efficiency} readonly />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Readability</div>
                    <StarRating rating={review.readability} readonly />
                  </div>
                </div>

                {/* Suggestions */}
                {review.suggestions.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Suggestions:</div>
                    <ul className="space-y-1">
                      {review.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => markHelpful(review.id, true)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${review.isHelpful === true ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                        }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>

                    <button
                      onClick={() => markHelpful(review.id, false)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${review.isHelpful === false ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Not Helpful</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(review.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerReviewSystem;