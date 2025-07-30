// src/components/landing/FloatingActionButton.tsx
import React from 'react';
import AnalyticsService from '@/services/analyticsService'; // Assuming this service is available

export interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  isVisible?: boolean; // To control visibility, e.g., based on product stock or scroll position
  // Styling props
  bgColorClass?: string; // e.g., 'bg-bella'
  hoverBgColorClass?: string; // e.g., 'hover:bg-bella-dark'
  focusRingColorClass?: string; // e.g., 'focus:ring-bella-light'
  // Analytics specific props
  analyticsButtonName?: string;
  analyticsLocation?: string; // e.g., 'Floating Action Button'
  analyticsItemId?: string; // ID of the item being promoted
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  isVisible = true,
  bgColorClass = 'bg-bella', // Default from BedGuard
  hoverBgColorClass = 'hover:bg-bella-dark', // Default from BedGuard
  focusRingColorClass = 'focus:ring-bella-light', // Default from BedGuard
  analyticsButtonName,
  analyticsLocation = 'Floating Action Button',
  analyticsItemId
}) => {
  if (!isVisible) {
    return null;
  }

  const handleClick = () => {
    if (analyticsButtonName) {
        AnalyticsService.trackButtonClick(
            analyticsButtonName,
            analyticsLocation,
            analyticsItemId
        );
    }
    onClick();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 lg:hidden"> {/* Hidden on large screens */}
      <button
        onClick={handleClick}
        className={`${bgColorClass} ${hoverBgColorClass} text-white p-4 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 ${focusRingColorClass} transform hover:scale-110 transition-all duration-300 animate-pulse`}
        aria-label={ariaLabel}
      >
        {icon}
      </button>
    </div>
  );
};

export default FloatingActionButton;