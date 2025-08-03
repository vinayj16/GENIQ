import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-card border-t border-border/40 py-12">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-primary p-2 rounded-lg glow-primary">
                  <span className="text-xl font-bold text-primary-foreground">G</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gradient">GENIQ</h2>
                  <p className="text-xs text-muted-foreground">AI-Powered Interview Prep</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Master your technical interviews with AI-powered practice, company insights, 
                and comprehensive preparation tools designed for modern developers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  📧 hello@geniq.dev
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Problems</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">MCQs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Companies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Roadmaps</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/40">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 GENIQ. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;