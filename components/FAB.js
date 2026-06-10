'use client';

import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

export default function FloatingActionButtons() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Actions */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-fade-in-down origin-bottom">
          
          <a 
            href="https://wa.me/919876543210" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
            aria-label="Contact us on WhatsApp"
          >
            <span className="font-medium text-sm hidden sm:block">WhatsApp Support</span>
            <MessageCircle className="w-5 h-5" />
          </a>

          <a 
            href="tel:+919876543210" 
            className="flex items-center gap-3 bg-[var(--color-surface-light)] hover:bg-[var(--color-border)] border border-[var(--color-border-light)] text-white px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
            aria-label="Call Now / Connect Live"
          >
            <span className="font-medium text-sm hidden sm:block">Connect Live</span>
            <Phone className="w-5 h-5 text-[var(--color-accent-cyan)]" />
          </a>

        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(226,88,62,0.4)] transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, var(--color-accent-saffron), var(--color-accent-gold))' }}
        aria-label="Support options"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-scale-in text-black" />
        ) : (
          <MessageCircle className="w-6 h-6 animate-scale-in text-black" />
        )}
      </button>
    </div>
  );
}
