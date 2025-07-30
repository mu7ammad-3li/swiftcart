// src/components/FloatingContactButtons.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react'; // Using MessageCircle for Messenger
import AnalyticsService from '@/services/analyticsService';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'; // Correct path based on your files

export interface FloatingActionButtonsProps {
  whatsappNumber: string; // e.g., "+1234567890"
  messengerLink: string; // e.g., "https://m.me/yourpage"
  bottomPositionClass?: string;
  rightPositionClass?: string;
  spacingClass?: string;
  analyticsLocation?: string;
}

const FloatingContactButtons: React.FC<FloatingActionButtonsProps> = ({
  whatsappNumber,
  messengerLink,
  bottomPositionClass = 'bottom-5',
  rightPositionClass = 'right-5',
  spacingClass = 'space-y-3', // Space between buttons
  analyticsLocation = 'Floating Action Buttons Group'
}) => {

  const handleWhatsAppClick = () => {
    AnalyticsService.trackButtonClick(
      'WhatsApp FAB Click',
      analyticsLocation,
      undefined,
      `https://wa.me/${whatsappNumber.replace(/\+/g, '')}` // Remove all '+' for wa.me link
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`, '_blank', 'noopener,noreferrer');
  };

  const handleMessengerClick = () => {
    AnalyticsService.trackButtonClick(
      'Messenger FAB Click',
      analyticsLocation,
      undefined,
      messengerLink
    );
    window.open(messengerLink, '_blank', 'noopener,noreferrer');
  };

  // Consistent with the original FloatingActionButton, hidden on large screens
  return (
    <div className={`fixed ${bottomPositionClass} ${rightPositionClass} z-50 flex flex-col ${spacingClass} items-end lg:hidden`}>
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-110 transition-all duration-300 animate-pulse" // Added animate-pulse like the original FAB
        aria-label="تواصل معنا عبر واتساب"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </button>

      {/* Messenger Button */}
      <button
        onClick={handleMessengerClick}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-110 transition-all duration-300 animate-pulse" // Added animate-pulse
        aria-label="تواصل معنا عبر ماسنجر"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatingContactButtons;