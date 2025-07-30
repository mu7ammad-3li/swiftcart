// src/components/TestimonialCard.tsx
import React from "react";
import { Star, User, Globe } from "lucide-react"; // Keep User and Globe
import { Testimonial, TestimonialPlatform } from "@/data/testimonials";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Import your custom SVG icons
import FacebookIcon from "@/components/icons/FacebookIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import PhoneIcon from "@/components/icons/PhoneIcon"; // Using your provided phone icon

interface PlatformIconProps {
  platform: TestimonialPlatform;
  className?: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className }) => {
  // Adjust size as needed, here it defaults to Tailwind's h-4 w-4
  const iconProps = { className: cn("h-4 w-4", className) };
  switch (platform) {
    case "facebook":
      return <FacebookIcon {...iconProps} />;
    case "whatsapp":
      return <WhatsAppIcon {...iconProps} />;
    case "google":
      return <GoogleIcon {...iconProps} />;
    case "website":
      return <Globe {...iconProps} />; // Lucide's Globe is fine for 'website'
    case "phone":
      return <PhoneIcon {...iconProps} />;
    default:
      return null;
  }
};

const platformDisplayNames: Record<TestimonialPlatform, string> = {
  facebook: "فيسبوك",
  whatsapp: "واتساب",
  google: "جوجل",
  website: "الموقع",
  phone: "هاتفياً", // Changed for clarity
};

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="glass-card h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-white/50 shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className =
                "flex h-12 w-12 items-center justify-center rounded-full bg-bella/20 text-bella";
              fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user h-6 w-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
              target.parentNode?.insertBefore(fallback, target.nextSibling);
            }}
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bella/20 text-bella border-2 border-white/30 shadow-sm">
            <User className="h-6 w-6" />
          </span>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-bold text-gray-800">
            {testimonial.name}
          </CardTitle>
          {testimonial.location && (
            <p className="text-sm text-gray-600">{testimonial.location}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4">
        <p className="text-gray-700 leading-relaxed text-base">
          <span className="text-2xl text-bella-dark/70 block float-right ml-1 mt-[-2px]">
            ❞
          </span>
          {testimonial.testimonial}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-3 pb-4 border-t border-white/20 mt-auto">
        {testimonial.rating && (
          <div className="flex items-center mb-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < testimonial.rating!
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
          </div>
        )}
        <div className="w-full text-xs text-gray-500 space-y-1">
          {testimonial.productUsed && (
            <p>
              منتج:{" "}
              <span className="font-medium text-bella">
                {testimonial.productUsed}
              </span>
            </p>
          )}
          {testimonial.date && (
            <p>
              {new Date(testimonial.date).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {testimonial.platform && (
            <div className="flex items-center gap-1.5 pt-1 text-gray-500">
              <PlatformIcon
                platform={testimonial.platform}
                className="text-bella-dark/80"
              />
              <span>عبر {platformDisplayNames[testimonial.platform]}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
