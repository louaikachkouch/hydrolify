import React from 'react';
import { Link } from 'react-router-dom';
import { companyBranding } from '../../data/mockData';
import { Button } from '../../components/ui';
import {
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

/**
 * Store Directory - Landing page showing all available stores
 */
export default function StoreDirectory() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt={companyBranding.name}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-secondary-800">
                {companyBranding.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-secondary-600 hover:text-secondary-800"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button size="sm">Create Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
            {companyBranding.tagline}
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            {companyBranding.description}. Join thousands of entrepreneurs building their online stores with us.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="px-8">
                Start Your Free Store
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <a href="#stores" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse Stores →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyBranding.features.map((feature, index) => {
              const icons = [SparklesIcon, ShieldCheckIcon, ChartBarIcon, CreditCardIcon];
              const Icon = icons[index];
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-secondary-800">{feature}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Create your online store in minutes. No coding required.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{companyBranding.name}</span>
            </div>
            <p className="text-sm">
              © 2026 {companyBranding.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button type="button" className="hover:text-white transition-colors">Privacy</button>
              <button type="button" className="hover:text-white transition-colors">Terms</button>
              <a href={`mailto:${companyBranding.supportEmail}`} className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
