// src/components/landing/GlobalFloatingButtons.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react'; // Or your preferred Messenger icon
import AnalyticsService from '@/services/analyticsService';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'; //

// Props for the optional primary action button, derived from FloatingActionButtonProps
export interface PrimaryActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  isVisible?: boolean;
  bgColorClass?: string;
  hoverBgColorClass?: string;
  focusRingColorClass?: string;
  analyticsButtonName?: string;
  analyticsLocation?: string; // Specific analytics location for this button
  analyticsItemId?: string;
}

// Combined props for the new component
export interface GlobalFloatingButtonsProps {
  whatsappNumber: string;
  messengerLink: string;
  primaryButton?: PrimaryActionButtonProps; // Optional primary action button
  bottomPositionClass?: string;
  rightPositionClass?: string;
  spacingClass?: string; // Vertical spacing between buttons
  analyticsLocation?: string; // Default analytics location for the button group
}

const GlobalFloatingButtons: React.FC<GlobalFloatingButtonsProps> = ({
  whatsappNumber,
  messengerLink,
  primaryButton,
  bottomPositionClass = 'bottom-5',
  rightPositionClass = 'right-5',
  spacingClass = 'space-y-3',
  analyticsLocation = 'Global Floating Buttons Group' // Default location for the group
}) => {

  const handleWhatsAppClick = () => {
    AnalyticsService.trackButtonClick(
      'WhatsApp FAB Click',
      `${analyticsLocation} - Contact Buttons`, // уточненное местоположение
      undefined,
      `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`, '_blank', 'noopener,noreferrer');
  };

  const handleMessengerClick = () => {
    AnalyticsService.trackButtonClick(
      'Messenger FAB Click',
      `${analyticsLocation} - Contact Buttons`, // уточненное местоположение
      undefined,
      messengerLink
    );
    window.open(messengerLink, '_blank', 'noopener,noreferrer');
  };

  const handlePrimaryActionClick = () => {
    if (primaryButton?.onClick) { // Ensure onClick is defined
        if (primaryButton.analyticsButtonName) {
            AnalyticsService.trackButtonClick(
                primaryButton.analyticsButtonName,
                primaryButton.analyticsLocation || analyticsLocation, // Use primary's location, fallback to group's
                primaryButton.analyticsItemId
            );
        }
        primaryButton.onClick();
    }
  };

  // Determine if the primary button should be considered for rendering the container
  // Render container if contact buttons are present or if a visible primary button is configured
  const isPrimaryButtonConfiguredAndVisible = primaryButton && (primaryButton.isVisible === undefined || primaryButton.isVisible);

  if (!whatsappNumber && !messengerLink && !isPrimaryButtonConfiguredAndVisible) {
    return null; // If no buttons are effectively visible or configured, render nothing
  }

  // Hidden on large screens, consistent with original FABs
  return (
    <div className={`fixed ${bottomPositionClass} ${rightPositionClass} z-50 flex flex-col ${spacingClass} items-end lg:hidden`}>
      {/* WhatsApp Button */}
      {whatsappNumber && (
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-110 transition-all duration-1000 animate-pulse"
          aria-label="تواصل معنا عبر واتساب"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </button>
      )}

      {/* Messenger Button */}
      {messengerLink && (
        <button
          onClick={handleMessengerClick}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-110 transition-all duration-1000 animate-pulse"
          aria-label="تواصل معنا عبر ماسنجر"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Optional Primary Action Button */}
      {isPrimaryButtonConfiguredAndVisible && primaryButton && (
        <button
          onClick={handlePrimaryActionClick}
          className={`${primaryButton.bgColorClass || 'bg-bella'} ${primaryButton.hoverBgColorClass || 'hover:bg-bella-dark'} text-white p-4 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 ${primaryButton.focusRingColorClass || 'focus:ring-bella-light'} transform hover:scale-110 transition-all duration-500 animate-pulse`}
          aria-label={primaryButton.ariaLabel}
        >
          {primaryButton.icon}
        </button>
      )}
    </div>
  );
};

export default GlobalFloatingButtons;