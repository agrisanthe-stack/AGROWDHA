import { Award, Sparkles, Brain } from "lucide-react";

interface ZbnfBadgeProps {
  isZbnfCertified: boolean;
  hasAISubscription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function ZbnfBadge({ 
  isZbnfCertified, 
  hasAISubscription = false, 
  size = 'md', 
  showText = true,
  className = ''
}: ZbnfBadgeProps) {
  if (!isZbnfCertified) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  if (hasAISubscription) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold ${sizeClasses[size]} ${className}`}>
        <div className="flex items-center gap-1">
          <Brain size={iconSizes[size]} />
          <Sparkles size={iconSizes[size]} />
        </div>
        {showText && <span>AI Organic Certified</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold ${sizeClasses[size]} ${className}`}>
      <Award size={iconSizes[size]} />
      {showText && <span>Organic Certified</span>}
    </div>
  );
}