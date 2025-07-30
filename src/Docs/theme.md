# Bella Egypt Website Theme Documentation

This document summarizes the design principles, color scheme, typography, components, and UI patterns used in the Bella Egypt website. Use this as a reference when building similar websites.

## 🎨 Color Palette

### Primary Colors

- **Primary Orange (`bella`)**: `#F7941D` - Used for buttons, highlights, and emphasis
- **Light Orange (`bella-light`)**: `#FBB867` - Used for hover states and secondary elements
- **Dark Orange (`bella-dark`)**: `#D67A0A` - Used for button hover states
- **White (`bella-foreground`)**: `#FFFFFF` - Text color on bella backgrounds
- **Alert Red (`bella-alert`)**: `#ff033d` - Used for price discounts and alerts

### System Colors

- **Background**: `#FFFFFF` (white)
- **Text**: Dark gray for body text, black for headings
- **Secondary Background**: `#F5F5F5` (light gray) for sections and cards
- **Border Color**: Light gray for subtle separations

## 📝 Typography

### Font Families

- **Primary Font**: "Tajawal" - A modern Arabic/Latin font that works well for both Arabic and English text
- **Font Weights**: 300 (light), 400 (regular), 500 (medium), 700 (bold), 800 (extra bold)

### Text Styles

- **Headings**: Bold weight, slightly larger line height
- **Body Text**: Regular weight, comfortable line height for readability
- **Direction**: RTL (Right-to-Left) as the default direction for Arabic content
- **Special Elements**: Some elements use LTR (Left-to-Right) via the `.direction-ltr` class

## 🧩 Components

### Buttons

- **Primary Button (bella-button)**: Orange background, white text, rounded corners, hover effect with shadow and slight lift

```css
.bella-button {
  @apply bg-bella hover:bg-bella-dark text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1;
}
```

- **Secondary Button**: White/transparent with orange border and text, changes to filled on hover

### Cards

- **Glass Cards**: Semi-transparent white background with blur effect, subtle border and shadow

```css
.glass-card {
  @apply bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg;
}
```

### Navigation

- **Navbar**: Fixed position, transparent on top and white with shadow when scrolled
- **Mobile Menu**: Collapsible menu for small screens

### Badges/Tags

- **Badge**: Orange gradient background with white text, rounded full shape

## 🖼️ Visual Elements

### Gradients

- **Bella Gradient**: Orange to light orange gradient

```css
.bella-gradient {
  @apply bg-gradient-to-r from-bella to-bella-light text-white;
}
```

### Shadows

- Subtle shadows for cards and containers
- More pronounced shadows for interactive elements on hover

### Effects

- **Blur Effects**: Background blur for glass-like components
- **Hover Animations**: Scale and shadow changes on interactive elements
- **Reveal Animations**: Elements fade/slide in as they enter the viewport

## 📱 Responsive Design

- Mobile-first approach with breakpoints at:
  - `md`: 768px (medium devices)
  - `lg`: 1024px (large devices)
- Element sizing and spacing adjust appropriately across screen sizes
- Grid layouts shift from single column on mobile to multi-column on larger screens

## 🧠 Layout Patterns

### Containers

- **Bella Container**: Centered content with responsive padding

```css
.bella-container {
  @apply container mx-auto px-4 md:px-8 lg:px-12;
}
```

### Section Structure

- Hero section with image and call-to-action
- Feature grid with icons and descriptions
- Product showcase with featured items
- Services section with cards or grid

## ✨ Animation

### Reveal Animations

- Elements start with `opacity: 0` and animate in when they enter the viewport
- Uses Intersection Observer API to trigger animations

```css
.reveal {
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
```

### Loading Animation

- Custom spinner with rotating animation

```css
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid hsl(var(--primary) / 0.2);
  border-bottom-color: hsl(var(--primary));
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
```

## 🛠️ UI Utilities and Framework

- **Tailwind CSS**: Used extensively for styling
- **ShadCN UI**: Component library for UI elements
- **React Router**: For navigation between pages
- **React Query**: For data fetching and state management

## 📏 Spacing and Sizing

- Consistent spacing using Tailwind's spacing scale
- Responsive padding and margins that adjust based on screen size
- Container width constrained on larger screens for optimal readability

## 📱 Important Considerations

- **RTL Support**: The entire site is designed for RTL (Arabic) text
- **Responsive Images**: Product images with proper scaling and containment
- **Loading States**: Spinner component used during data loading
- **Error Handling**: Proper error states for failed data fetching
