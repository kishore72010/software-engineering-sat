import React from 'react';
import { MapPin, Phone, Mail, Clock, Utensils, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-ivory-100 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Story */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-terracotta-600 text-white flex items-center justify-center">
                <Utensils className="w-5 h-5 text-champagne-400" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-ivory-50">
                L'AURA
              </span>
            </div>
            <p className="text-sm text-charcoal-600 text-ivory-300/80 leading-relaxed">
              Curating exceptional culinary moments through bespoke seating, culinary craft, and effortless table reservations.
            </p>
            <div className="pt-2 text-xs text-champagne-400 font-medium">
              Software Engineering Practical Project Demonstration
            </div>
          </div>

          {/* Dining Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-ivory-50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta-400" />
              Service Hours
            </h4>
            <div className="text-sm text-ivory-300/80 space-y-1.5">
              <div className="flex justify-between">
                <span>Mon – Fri:</span>
                <span>12:00 PM – 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sat – Sun:</span>
                <span>11:30 AM – 11:30 PM</span>
              </div>
              <div className="flex justify-between text-terracotta-400 font-medium pt-1">
                <span>Dinner Slots:</span>
                <span>19:30 – 21:30</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-ivory-50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-400" />
              Location & Contact
            </h4>
            <div className="text-sm text-ivory-300/80 space-y-2">
              <p className="flex items-start gap-2">
                <span>74 Heritage Promenade, Fine Arts District, Bengaluru, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-champagne-400" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-champagne-400" />
                <span>concierge@laura-dining.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-ivory-50">Navigation</h4>
            <div className="flex flex-col space-y-2 text-sm text-ivory-300/80">
              <Link to="/" className="hover:text-champagne-400 transition">
                Home
              </Link>
              <Link to="/tables" className="hover:text-champagne-400 transition">
                Live Table Availability
              </Link>
              <Link to="/book" className="hover:text-champagne-400 transition">
                Make a Reservation
              </Link>
              <Link to="/login" className="hover:text-champagne-400 transition">
                Customer Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-800 text-center text-xs text-ivory-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 L'Aura Restaurant. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Engineered with <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" /> using Spring Boot 3 & React TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
};
