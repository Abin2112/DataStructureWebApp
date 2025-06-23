import React from 'react';
import { BookOpen, Linkedin, Instagram, Mail, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'data-structures' | 'about' | 'contact') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div 
              className="flex items-center space-x-3 mb-4 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Data Structures Academy</h3>
                <p className="text-gray-400 text-sm">Interactive Learning Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Master fundamental data structures through interactive visualizations, comprehensive notes, 
              challenging quizzes, and real-world implementation examples. Your journey to algorithmic excellence starts here.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-400">Built with</span>
                <div className="flex items-center space-x-1 mt-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">React & TypeScript</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('data-structures')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Data Structures
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Learning</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('data-structures')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Interactive Demos
                </button>
              </li>
              <li>
                <span className="text-gray-300">Study Notes</span>
              </li>
              <li>
                <span className="text-gray-300">Practice Quizzes</span>
              </li>
              <li>
                <span className="text-gray-300">Code Examples</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Creator Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 mb-2">
                Created by <span className="font-semibold text-white">Abin Pillai</span>
              </p>
              <p className="text-sm text-gray-400">
                Full Stack Developer & Data Structures Enthusiast
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.linkedin.com/in/abin-pillai-026252298/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition-colors group"
                title="Connect on LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </a>
              <a
                href="https://www.instagram.com/_abin_2107?igsh=MTI5eDN1dG4yMmo2Zw=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-pink-600 p-3 rounded-lg transition-colors group"
                title="Follow on Instagram"
              >
                <Instagram className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition-colors group"
                title="Send Email"
              >
                <Mail className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              © 2025 Data Structures Academy. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => onNavigate('contact')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <a 
                href="https://github.com/Abin2112/Data-Structure-" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>Open Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}