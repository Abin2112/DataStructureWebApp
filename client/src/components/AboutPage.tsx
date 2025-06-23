import React from 'react';
import { User, Code, Briefcase, GraduationCap, Award, Heart, Lightbulb, Target, Github, Linkedin, Mail } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <User className="h-16 w-16 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
            <Code className="h-4 w-4 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Abin Pillai</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Full Stack Developer & Data Structures Enthusiast passionate about creating 
          educational technology that makes learning programming concepts accessible and engaging.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="flex items-center mb-6">
          <Heart className="h-6 w-6 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">My Story</h2>
        </div>
        <div className="prose prose-lg text-gray-700 leading-relaxed">
          <p className="mb-4">
  Hello! I'm <strong>Abin Pillai</strong>, a passionate full stack developer with a deep interest in 
  computer science fundamentals and educational technology. My programming journey began with a 
  curiosity about how things work under the hood, which naturally led me to explore data structures 
  and algorithms.
</p>
<p className="mb-4">
  Under the guidance of <strong><a href="https://www.linkedin.com/in/kgkmahendra/" target="_blank" rel="noopener noreferrer">
  Dr. Mahendra Kanojia</a></strong>, I strengthened my core knowledge and grew more confident in my skills. 
  After working with various technologies and helping fellow developers understand complex concepts, 
  I realized the need for better, more interactive learning tools. My mentor Dr. Mahendra Kanojia helped 
  me create <strong> Data Structures Academy</strong> — a platform built to make learning data structures 
  engaging, visual, and practical.
</p>
<p className="mb-4">
  When I'm not coding, you’ll find me exploring new technologies, contributing to open-source 
  projects. etc. I believe that education should be accessible to 
  everyone, and that technology is a powerful tool to help achieve that goal.
</p>
        </div>
      </div>

      {/* Skills & Expertise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Code className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Technical Skills</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Frontend Development</span>
                <span className="text-sm text-gray-500">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Backend Development</span>
                <span className="text-sm text-gray-500">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Data Structures & Algorithms</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Full Stack Development</span>
                <span className="text-sm text-gray-500">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Briefcase className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Experience</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900">Full Stack Developer Intern </h4>
              <p className="text-sm text-gray-600 mb-2">Talent Corner HR Services • April 2025- Present</p>
              <p className="text-sm text-gray-700">
                Developing a comprehensive company data dashboard as a Full Stack Developer Intern using React+Vite, Tailwind CSS, Node.js, and MySQL.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Backend Developer Intern</h4>
              <p className="text-sm text-gray-600 mb-2">SHETH L.U.J & SIR M.V. COLLEGE •  July 2024 - Jan 2025 </p>
              <p className="text-sm text-gray-700">
                Developed and optimized the backend functionalities of a college chatbot, ensuring seamless interactions between users and the system. Managed Large Language Model (LLM) responses to enhance accuracy and efficiency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Front Desk and Data Management Intern</h4>
              <p className="text-sm text-gray-600 mb-2">Computer Education Center • April 2024 - Dec 2024</p>
              <p className="text-sm text-gray-700">
                Handled data management using Excel and Google Sheets, ensuring accuracy and efficiency. Demonstrated technical prowess by creating and managing complex spreadsheets, documents, and online forms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Education & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <GraduationCap className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Education</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Bachelor of Science</h4>
              <p className="text-sm text-gray-600">Computer Science </p>
              <p className="text-sm text-gray-500">University of Mumbai • 2023 - 2026</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Certifications</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Mastering Prompt Engineering course</li>
                <li>• Android Development with Kotlin Course from Google</li>
                <li>• Basic Data Science Course from Computer Education Center</li>
                <li>• Introduction to Data Science Course from Computer Education Center</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Award className="h-6 w-6 text-yellow-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Secured 1st Place In Research Presentation Competition</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Reached the final round of the Mumbai District Level Aavishkar Research Convention</h4>
                
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Secured 1st Place In GenAI Software Demonstration Competition</h4>
                
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Secured 1st Place In Data Structure Presentation</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Secured 2nd Place In Advanced Python Presentation</h4>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
        <div className="text-center">
          <Lightbulb className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Mission & Vision</h3>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            My mission is to democratize computer science education by creating interactive, 
            engaging, and accessible learning platforms. I envision a world where anyone, 
            regardless of their background, can master complex programming concepts through 
            innovative educational technology.
          </p>
        </div>
      </div>

      {/* Technologies */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Technologies I Work With</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
  'Programming Languages - Python, R Software, HTML, CSS, Django, JavaScript',
  'AI / ML Frameworks & Libraries - Scikit-learn, NumPy, Pandas',
  'IDEs - VS Code, Visual Studio, RStudio',
  'Databases - MySQL, Oracle, MongoDB',
  'Version Control Systems - Git and GitHub',
  'Libraries & Frameworks - NumPy, Pandas, Matplotlib, Scikit-learn',
  'Currently Learning - React, Node.js, Angular, Flutter, Android Development',
  'Blogs - Writing and publishing technical blogs on Medium and WordPress',
  'Soft Skills - Problem-solving, Collaborative, Passionate'
].map((tech, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-sm font-medium text-gray-700">{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connect */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Let's Connect</h3>
        <p className="text-gray-600 mb-6">
          I'm always excited to connect with fellow developers, educators, and learners. 
          Feel free to reach out for collaborations, questions, or just to say hello!
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://www.linkedin.com/in/abin-pillai-026252298/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/Abin2112/Data-Structure-"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-lg transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="mailto:pillaiabincs232414@gmail.com"
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}