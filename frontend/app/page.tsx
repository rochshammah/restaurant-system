'use client';

import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { ArrowRight, CheckCircle, Zap, BarChart3, Users, Clock, Shield } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Smart Order Management',
      description: 'Streamline orders from multiple channels - dine-in, takeaway, and delivery - all in one unified system.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Coordination',
      description: 'Seamless communication between waiters, kitchen staff, and management with real-time updates.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Faster Service',
      description: 'Reduce order processing time and improve customer satisfaction with instant notifications.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Business Analytics',
      description: 'Track revenue, popular items, order trends, and performance metrics in real-time dashboards.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Bank-level security with encrypted data, role-based access control, and backup systems.',
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Easy Integration',
      description: 'Works with your existing menu, pricing, and payment systems. No complex setup required.',
    },
  ];

  const benefits = [
    'Increase order accuracy by 95%',
    'Reduce order preparation time by 40%',
    'Boost customer satisfaction scores',
    'Minimize food waste and inventory loss',
    'Real-time kitchen display system',
    'Mobile-friendly customer interface',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Restaurant System</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Restaurant Into a <span className="text-blue-600">Smart Operation</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete restaurant order management system. Streamline operations, boost efficiency, and delight your customers with real-time order tracking and kitchen coordination.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button variant="primary" className="flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="secondary">Watch Demo</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-300">
            <div>
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <p className="text-gray-600 mt-2">Order Accuracy</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">40%</div>
              <p className="text-gray-600 mt-2">Faster Delivery</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <p className="text-gray-600 mt-2">Restaurants Trust Us</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features Built for Success</h2>
            <p className="text-xl text-gray-600">Everything you need to run a modern restaurant</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Restaurant System?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Developed by restaurant professionals who understand the challenges you face every day.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/login">
                  <Button variant="primary">Start Your Free Trial</Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold mb-2">Real-Time Dashboard</div>
                  <p className="text-blue-100">Monitor all orders, track kitchen status, and manage inventory from one beautiful interface.</p>
                </div>
                <div className="h-64 bg-blue-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-blue-100">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Perfect For All Restaurant Types</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fine Dining',
                description: 'Enhance customer experience with sophisticated order management and table coordination.',
                icon: '🍽️',
              },
              {
                title: 'Fast Casual',
                description: 'Speed up service with quick order processing and kitchen coordination.',
                icon: '⚡',
              },
              {
                title: 'Cloud Kitchens',
                description: 'Manage multiple delivery orders efficiently with real-time tracking.',
                icon: '🚀',
              },
              {
                title: 'Cafes & Bakeries',
                description: 'Simple, intuitive system perfect for smaller operations.',
                icon: '☕',
              },
              {
                title: 'Food Courts',
                description: 'Handle multiple vendors and high order volumes effortlessly.',
                icon: '🏪',
              },
              {
                title: 'Hotels & Resorts',
                description: 'Room service, dining, and event catering all in one system.',
                icon: '🏨',
              },
            ].map((useCase, idx) => (
              <div key={idx} className="text-center p-8 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl text-blue-100 mb-8">Join hundreds of restaurants already using our system to streamline operations and boost profits.</p>
          <Link href="/login">
            <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2026 Restaurant System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
