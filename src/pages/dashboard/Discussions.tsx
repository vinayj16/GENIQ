import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, ThumbsUp, Share2, Plus, Search, TrendingUp, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Two Sum Problem - Alternative Approaches",
      content: "I solved the Two Sum problem using the hash map approach. Are there any other efficient methods?",
      author: "CodeMaster123",
      avatar: null,
      likes: 15,
      replies: 8,
      tags: ["algorithms", "arrays", "leetcode"],
      createdAt: "2 hours ago",
      category: "Problem Discussion"
    },
    {
      id: 2,
      title: "Interview Experience at Google - SDE II",
      content: "Just completed my Google interview process. Happy to share my experience and tips!",
      author: "TechExplorer",
      avatar: null,
      likes: 42,
      replies: 23,
      tags: ["interview", "google", "experience"],
      createdAt: "1 day ago",
      category: "Interview Experience"
    },
    {
      id: 3,
      title: "System Design - URL Shortener Best Practices",
      content: "Looking for feedback on my URL shortener design. What database would you recommend for scale?",
      author: "SystemGuru",
      avatar: null,
      likes: 28,
      replies: 12,
      tags: ["system-design", "scalability", "architecture"],
      createdAt: "3 days ago",
      category: "System Design"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [likedDiscussions, setLikedDiscussions] = useState<Set<number>>(new Set());
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'Problem Discussion',
    tags: ''
  });

  const categories = ['All', 'Problem Discussion', 'Interview Experience', 'System Design', 'Career Advice', 'Study Groups'];

  const filteredDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || discussion.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'replies':
          return b.replies - a.replies;
        case 'recent':
        default:
          return b.id - a.id; // Assuming higher ID means more recent
      }
    });

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const discussion = {
      id: discussions.length + 1,
      ...newDiscussion,
      author: 'You',
      avatar: null,
      likes: 0,
      replies: 0,
      tags: newDiscussion.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: 'Just now'
    };

    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: '', content: '', category: 'Problem Discussion', tags: '' });
    setShowNewDiscussion(false);
    toast.success('Discussion created successfully!');
  };

  const handleLike = (id: number) => {
    const isLiked = likedDiscussions.has(id);
    
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === id 
        ? { ...discussion, likes: discussion.likes + (isLiked ? -1 : 1) }
        : discussion
    ));
    
    setLikedDiscussions(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(id);
        toast.success('Like removed');
      } else {
        newSet.add(id);
        toast.success('Liked!');
      }
      return newSet;
    });
  };

  const handleShare = (discussion: any) => {
    if (navigator.share) {
      navigator.share({
        title: discussion.title,
        text: discussion.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Community Discussions 💬</h1>
          <p className="text-muted-foreground">Connect with fellow developers and share knowledge</p>
        </div>
        <Button 
          onClick={() => setShowNewDiscussion(true)}
          className="btn-premium"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {/* New Discussion Form */}
      {showNewDiscussion && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Create New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Discussion title..."
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
            />
            <Textarea
              placeholder="Share your thoughts, questions, or experiences..."
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
              rows={4}
            />
            <div className="flex gap-3">
              <select 
                value={newDiscussion.category}
                onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Input
                placeholder="Tags (comma separated)"
                value={newDiscussion.tags}
                onChange={(e) => setNewDiscussion({...newDiscussion, tags: e.target.value})}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateDiscussion} className="btn-premium">
                Create Discussion
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewDiscussion(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-premium" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Popular
                  </div>
                </SelectItem>
                <SelectItem value="replies">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Most Replies
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map(discussion => (
          <Card key={discussion.id} className="card-elevated hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={discussion.avatar} />
                  <AvatarFallback>{discussion.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{discussion.author}</span>
                        <span>•</span>
                        <span>{discussion.createdAt}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {discussion.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {discussion.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLike(discussion.id)}
                        className={`hover:text-primary ${likedDiscussions.has(discussion.id) ? 'text-primary bg-primary/10' : ''}`}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${likedDiscussions.has(discussion.id) ? 'fill-current' : ''}`} />
                        {discussion.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-primary">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {discussion.replies}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:text-primary"
                        onClick={() => handleShare(discussion)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button size="sm" className="btn-premium">
                      Join Discussion
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiscussions.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
            </p>
            <Button onClick={() => setShowNewDiscussion(true)} className="btn-premium">
              Start Discussion
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Discussions;