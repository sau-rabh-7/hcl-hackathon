import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 group hover:rotate-0 transition-transform cursor-pointer">
                <span className="text-brand-red font-black text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>M</span>
              </div>
              <span className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Mc<span className="text-brand-yellow font-black">Hackathon</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Bringing the world's favorite flavors right to your doorstep. Fresh ingredients, lightning-fast delivery, and a passion for great food.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-yellow hover:text-brand-dark rounded-xl flex items-center justify-center transition-all duration-300 group">
                <Facebook className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-yellow hover:text-brand-dark rounded-xl flex items-center justify-center transition-all duration-300 group">
                <Instagram className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-yellow hover:text-brand-dark rounded-xl flex items-center justify-center transition-all duration-300 group">
                <Twitter className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link to="/" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Home Our Menu</Link></li>
              <li><Link to="/orders" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Track Order</Link></li>
              <li><Link to="/login" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Admin Panel Login</Link></li>
              <li><a href="#" className="hover:text-brand-yellow transition-colors flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-5 text-gray-400 text-sm font-medium">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>HCL Technologies Campus,<br/>Sector 126, Noida, UP - 201301</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 98048 XXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <Mail className="w-4 h-4" />
                </div>
                <span>saurabh98048@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></span>
              Open Hours
            </h4>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Monday - Friday</span>
                <span className="text-white font-bold">09AM - 11PM</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Saturday</span>
                <span className="text-white font-bold">10AM - 12AM</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-gray-400">Sunday</span>
                <span className="text-brand-yellow font-black">OPEN 24HRS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-medium">
            © {currentYear} McHackathon. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-500 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Developed for <span className="text-brand-yellow">HCL Hackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper component for Chevron
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);

export default Footer;
