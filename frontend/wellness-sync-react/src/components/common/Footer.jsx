import React from 'react';
import { Heart, Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-xl rounded-2xl mt-8 border border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wellness Sync
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your personal wellness companion for tracking habits, mood, and mental health.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Dashboard</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Habits</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Mood Tracking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Journal</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Analytics</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">support@wellnesssync.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-gray-500" />
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">GitHub</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Wellness Sync. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-gray-500 text-sm">for your wellness journey</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;