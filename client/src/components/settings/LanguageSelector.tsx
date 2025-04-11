import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const languages = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "kk", label: "Қазақша", flag: "🇰🇿" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "cn", label: "中文", flag: "🇨🇳" },
  { value: "jp", label: "日本語", flag: "🇯🇵" }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange?: (language: string) => void;
}

export function LanguageSelector({ 
  currentLanguage = "en", 
  onLanguageChange 
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentLanguage);
  const { toast } = useToast();

  const handleSelectLanguage = async (selectedValue: string) => {
    setValue(selectedValue);
    setOpen(false);
    
    if (onLanguageChange) {
      onLanguageChange(selectedValue);
    }
    
    try {
      await apiRequest("PATCH", "/api/user/settings", { 
        preferredLanguage: selectedValue 
      });
      
      toast({
        title: "Language Updated",
        description: "Your preferred language has been updated.",
      });
    } catch (error) {
      console.error("Failed to update language preference:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update language. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedLanguage = languages.find(language => language.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedLanguage ? (
            <div className="flex items-center">
              <span className="mr-2">{selectedLanguage.flag}</span>
              {selectedLanguage.label}
            </div>
          ) : (
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Select language...
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search languages..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language.value}
                value={language.value}
                onSelect={() => handleSelectLanguage(language.value)}
              >
                <span className="mr-2">{language.flag}</span>
                {language.label}
                <Check
                  className={`ml-auto h-4 w-4 ${value === language.value ? "opacity-100" : "opacity-0"}`}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}