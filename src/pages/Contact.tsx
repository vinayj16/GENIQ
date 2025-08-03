import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon. 📧');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <main className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gradient mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                Get in touch with our team. We're here to help!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="card-glow">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Feature Request</option>
                      <option>Business Partnership</option>
                      <option>Bug Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea 
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us more about your inquiry..."
                      required
                    ></textarea>
                  </div>
                  <Button 
                    type="submit" 
                    className="btn-hero w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '📤 Sending...' : '📧 Send Message'}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="card-elevated">
                  <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">hello@geniq.dev</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="font-medium">Office</p>
                        <p className="text-muted-foreground">San Francisco, CA</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-elevated">
                  <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="btn-premium">
                      🐦 Twitter
                    </Button>
                    <Button variant="outline" className="btn-premium">
                      💼 LinkedIn
                    </Button>
                    <Button variant="outline" className="btn-premium">
                      🐙 GitHub
                    </Button>
                    <Button variant="outline" className="btn-premium">
                      📱 Discord
                    </Button>
                  </div>
                </div>

                <div className="card-elevated">
                  <h3 className="text-xl font-bold mb-4">📚 Resources</h3>
                  <div className="space-y-3">
                    <a href="#" className="block text-primary hover:text-primary-glow transition-colors">
                      📖 Documentation
                    </a>
                    <a href="#" className="block text-primary hover:text-primary-glow transition-colors">
                      🎥 Video Tutorials
                    </a>
                    <a href="#" className="block text-primary hover:text-primary-glow transition-colors">
                      💡 Blog & Tips
                    </a>
                    <a href="#" className="block text-primary hover:text-primary-glow transition-colors">
                      ❓ FAQ
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {[
                  {
                    question: "How does GENIQ's AI-powered feedback work?",
                    answer: "Our AI analyzes your code for time complexity, space complexity, code quality, and suggests optimizations. It provides personalized hints based on your coding patterns and learning progress."
                  },
                  {
                    question: "Can I practice company-specific questions?",
                    answer: "Yes! We have curated problems from 500+ companies including Google, Amazon, Microsoft, Meta, and more. Each problem includes company tags and interview insights."
                  },
                  {
                    question: "Is there a free tier available?",
                    answer: "Absolutely! Our free tier includes access to 500+ problems, basic MCQs, community features, and progress tracking. You can upgrade to Pro for advanced features."
                  },
                  {
                    question: "How often is the content updated?",
                    answer: "We add new problems weekly and update company insights monthly based on recent interview experiences shared by our community."
                  }
                ].map((faq, index) => (
                  <div key={index} className="card-elevated">
                    <h4 className="font-bold mb-2">{faq.question}</h4>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;