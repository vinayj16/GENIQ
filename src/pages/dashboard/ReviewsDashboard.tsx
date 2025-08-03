import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ThumbsUp, ThumbsDown, Search, Filter, Calendar, Building } from 'lucide-react';
import { Review } from '@/types/dashboard';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

const ReviewsDashboard = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyInput, setCompanyInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  // Helper function to sanitize review data
  const sanitizeReview = (review: any): Review => {
    return {
      ...review,
      questions_asked: Array.isArray(review.questions_asked) 
        ? review.questions_asked.map((q: any) => typeof q === 'string' ? q : String(q))
        : [],
      interview_process: typeof review.interview_process === 'string' 
        ? review.interview_process 
        : String(review.interview_process || ''),
      preparation_tips: typeof review.preparation_tips === 'string' 
        ? review.preparation_tips 
        : String(review.preparation_tips || ''),
      company: String(review.company || ''),
      role: String(review.role || ''),
      experience: String(review.experience || 'Neutral'),
      difficulty: String(review.difficulty || 'Medium')
    };
  };
  const [newReview, setNewReview] = useState<Omit<Review, 'id' | 'date' | 'author'>>({
    company: '',
    role: '',
    experience: 'Positive',
    rating: 5,
    interview_process: '',
    questions_asked: [] as string[],
    preparation_tips: '',
    difficulty: 'Medium'
  });

  const fetchReviews = useCallback(async (company?: string, role?: string) => {
    try {
      setLoading(true);
      // Always make API call with current search criteria
      const data = await apiService.getReviews({ 
        company: company || '',
        role: role || ''
      });
      
      // Sanitize the review data to prevent rendering errors
      const sanitizedReviews = data.map(sanitizeReview);
      setReviews(sanitizedReviews);
      
      if (data.length === 0) {
        toast.info('No reviews found for this search. Try different criteria.');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch reviews. Please try again.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    additional_prep_tips: string;
    common_followup_questions: string[];
    industry_insights: string;
    salary_insights: string;
  } | null>(null);

  const submitReview = async () => {
    if (!newReview.company || !newReview.role) {
      toast.error('Please fill in company and role');
      return;
    }

    try {
      setSubmissionLoading(true);
      
      const reviewData = {
        ...newReview,
        questions_asked: newReview.questions_asked.filter(q => q.trim())
      };
      
      // Submit review to API and get AI insights
      const response = await apiService.submitReview(reviewData);
      
      // Update the reviews list with the new review (sanitized)
      setReviews([sanitizeReview(response.review), ...reviews]);
      
      // Store AI insights for display
      setAiInsights(response.aiInsights || null);
      
      // Reset form
      setNewReview({
        company: '',
        role: '',
        experience: 'Positive',
        rating: 5,
        interview_process: '',
        questions_asked: [],
        preparation_tips: '',
        difficulty: 'Medium'
      });
      
      toast.success(response.message || 'Review submitted successfully!');
      
      // Refresh the reviews list
      await fetchReviews();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review. Please try again.');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Positive': return 'bg-success/20 text-success border-success/30';
      case 'Mixed': return 'bg-warning/20 text-warning border-warning/30';
      case 'Negative': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success border-success/30';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'Hard': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleSearch = async () => {
    if (!companyInput.trim() && !roleInput.trim()) {
      toast.error('Please enter at least a company name or role');
      return;
    }
    setLoading(true);
    await fetchReviews(companyInput, roleInput);
    setLoading(false);
  };

  const handleClear = async () => {
    setCompanyInput('');
    setRoleInput('');
    setLoading(true);
    await fetchReviews();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="view-reviews" className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interview Reviews</h1>
            <p className="text-muted-foreground">Browse and share interview experiences.</p>
          </div>
          <TabsList>
            <TabsTrigger value="view-reviews">View Reviews</TabsTrigger>
            <TabsTrigger value="add-review">＋ Add Review</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="view-reviews">
          <Card className="mb-6 card-elevated">
            <CardHeader>
              <CardTitle>Find Reviews</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Company Name..."
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    className="w-48"
                  />
                  <Input
                    placeholder="Role..."
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-48"
                  />
                  <Button onClick={handleSearch}><Search className="h-4 w-4 mr-2" />Search</Button>
                  <Button variant="outline" onClick={handleClear}><Filter className="h-4 w-4 mr-2" />Clear</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {loading && (
              <Card className="card-elevated">
                <CardContent className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <div>
                      <p className="text-lg font-medium">Searching for reviews...</p>
                      <p className="text-sm text-muted-foreground">
                        {companyInput && roleInput 
                          ? `Looking for ${roleInput} reviews at ${companyInput}. If none exist, AI will generate insights for you!`
                          : 'Fetching available reviews...'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {!loading && reviews.length === 0 && (
              <Card className="card-elevated">
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">No reviews found for your search criteria.</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching with different company names or roles, or add your own review to help others!
                    </p>
                    {companyInput && roleInput && (
                      <Button 
                        onClick={() => fetchReviews(companyInput, roleInput)}
                        className="mt-4"
                      >
                        🤖 Generate AI Review for {roleInput} at {companyInput}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {!loading &&
            reviews
              .filter(Boolean)
              .map((review) => (
                <Card key={review.id} className="card-elevated hover:card-glow transition-all mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-primary">{review.role}</h3>
                          {(review as any).author === 'AI Generated' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              🤖 AI Generated
                            </Badge>
                          )}
                          {(review as any).author === 'User Submitted' && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              ✨ User Submitted
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                          <Building className="h-4 w-4" /> {review.company}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {getRatingStars(review.rating)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> {review.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={getExperienceColor(review.experience)}>
                        {review.experience}
                      </Badge>
                      <Badge className={getDifficultyColor(review.difficulty)}>
                        {review.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {review.interview_process && (
                        <div>
                          <h4 className="font-semibold mb-2">Interview Process</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {typeof review.interview_process === 'string' 
                              ? review.interview_process 
                              : typeof review.interview_process === 'object' 
                                ? JSON.stringify(review.interview_process, null, 2)
                                : String(review.interview_process)
                            }
                          </p>
                        </div>
                      )}

                      {review.questions_asked && review.questions_asked.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Questions Asked</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {review.questions_asked.map((q, i) => (
                              <li key={i} className="break-words">
                                {typeof q === 'string' ? q : typeof q === 'object' ? JSON.stringify(q) : String(q)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {review.preparation_tips && (
                        <div>
                          <h4 className="font-semibold mb-2">Preparation Tips</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {typeof review.preparation_tips === 'string' 
                              ? review.preparation_tips 
                              : typeof review.preparation_tips === 'object' 
                                ? JSON.stringify(review.preparation_tips, null, 2)
                                : String(review.preparation_tips)
                            }
                          </p>
                        </div>
                      )}

                      {/* Handle structured rounds data if present */}
                      {(review as any).rounds && Array.isArray((review as any).rounds) && (review as any).rounds.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Interview Rounds</h4>
                          <div className="space-y-2">
                            {(review as any).rounds.map((round: any, i: number) => (
                              <div key={i} className="bg-muted/20 p-3 rounded-lg">
                                <h5 className="font-medium text-sm">
                                  {typeof round === 'string' ? round : round.name || `Round ${i + 1}`}
                                </h5>
                                {typeof round === 'object' && round.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {round.description}
                                  </p>
                                )}
                                {typeof round === 'object' && round.questions && Array.isArray(round.questions) && (
                                  <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 ml-2">
                                    {round.questions.map((q: any, qi: number) => (
                                      <li key={qi}>{typeof q === 'string' ? q : String(q)}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-6">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="h-4 w-4" /> Helpful
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsDown className="h-4 w-4" /> Not Helpful
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="add-review">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Share Your Interview Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company *</label>
                  <Input
                    placeholder="e.g. Google, Microsoft..."
                    value={newReview.company}
                    onChange={(e) => setNewReview({...newReview, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role *</label>
                  <Input
                    placeholder="e.g. Software Engineer..."
                    value={newReview.role}
                    onChange={(e) => setNewReview({...newReview, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Overall Experience</label>
                  <Select value={newReview.experience} onValueChange={(value) => setNewReview({...newReview, experience: value as 'Positive' | 'Mixed' | 'Negative'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Positive">Positive</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                      <SelectItem value="Negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <Select value={newReview.difficulty} onValueChange={(value) => setNewReview({...newReview, difficulty: value as 'Easy' | 'Medium' | 'Hard'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({...newReview, rating})}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${rating <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Interview Process</label>
                <Textarea
                  rows={3}
                  placeholder="Describe the interview process, number of rounds, format, etc."
                  value={newReview.interview_process}
                  onChange={(e) => setNewReview({...newReview, interview_process: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Questions Asked (one per line)</label>
                <Textarea
                  rows={4}
                  placeholder="Tell me about yourself&#10;Design a URL shortener&#10;Describe a challenging project"
                  value={newReview.questions_asked.join('\n')}
                  onChange={(e) => setNewReview({...newReview, questions_asked: e.target.value.split('\n')})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preparation Tips</label>
                <Textarea
                  rows={3}
                  placeholder="Share tips for future candidates preparing for this role"
                  value={newReview.preparation_tips}
                  onChange={(e) => setNewReview({...newReview, preparation_tips: e.target.value})}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  className="btn-hero" 
                  onClick={submitReview}
                  disabled={submissionLoading}
                >
                  {submissionLoading ? '🤖 Generating AI Insights...' : '🚀 Submit Review'}
                </Button>
                <Button variant="outline" className="btn-premium" onClick={() => {
                  setNewReview({
                    company: '',
                    role: '',
                    experience: 'Positive',
                    rating: 5,
                    interview_process: '',
                    questions_asked: [],
                    preparation_tips: '',
                    difficulty: 'Medium'
                  });
                  setAiInsights(null);
                }}>
                  Clear Form
                </Button>
              </div>

              {/* AI Insights Display */}
              {aiInsights && (
                <Card className="mt-6 card-elevated bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      🤖 AI-Generated Insights
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Powered by Gemini AI
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiInsights.additional_prep_tips && (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">📚 Additional Preparation Tips</h4>
                        <p className="text-sm text-blue-700 bg-white/50 p-3 rounded-lg">
                          {aiInsights.additional_prep_tips}
                        </p>
                      </div>
                    )}

                    {aiInsights.common_followup_questions && aiInsights.common_followup_questions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">❓ Common Follow-up Questions</h4>
                        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 bg-white/50 p-3 rounded-lg">
                          {aiInsights.common_followup_questions.map((question, i) => (
                            <li key={i}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiInsights.industry_insights && (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">🏢 Industry Insights</h4>
                        <p className="text-sm text-blue-700 bg-white/50 p-3 rounded-lg">
                          {aiInsights.industry_insights}
                        </p>
                      </div>
                    )}

                    {aiInsights.salary_insights && (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">💰 Salary & Negotiation Tips</h4>
                        <p className="text-sm text-blue-700 bg-white/50 p-3 rounded-lg">
                          {aiInsights.salary_insights}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsDashboard;