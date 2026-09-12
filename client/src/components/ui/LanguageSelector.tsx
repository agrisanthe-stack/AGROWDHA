import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
];

interface LanguageSelectorProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export default function LanguageSelector({ variant = 'default', className = '' }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  
  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (variant === 'compact') {
    return (
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-auto min-w-[120px] ${className}`}>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage.name}</span>
            <span className="sm:hidden">{currentLanguage.flag}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Languages
      </label>
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}