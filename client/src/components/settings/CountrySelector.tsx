import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const countries = [
  { value: "kz", label: "Қазақстан", flag: "🇰🇿" },
  { value: "ru", label: "Россия", flag: "🇷🇺" },
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "gb", label: "United Kingdom", flag: "🇬🇧" }
];

interface CountrySelectorProps {
  currentCountry: string;
  onCountryChange?: (country: string) => void;
}

export function CountrySelector({ 
  currentCountry = "kz",
  onCountryChange 
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentCountry);

  const handleSelectCountry = (selectedValue: string) => {
    setValue(selectedValue);
    setOpen(false);

    if (onCountryChange) {
      onCountryChange(selectedValue);
    }
  };

  const selectedCountry = countries.find(country => country.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCountry ? (
            <div className="flex items-center">
              <span className="mr-2">{selectedCountry.flag}</span>
              {selectedCountry.label}
            </div>
          ) : (
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Select country...
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                value={country.value}
                onSelect={() => handleSelectCountry(country.value)}
              >
                <span className="mr-2">{country.flag}</span>
                {country.label}
                <Check
                  className={`ml-auto h-4 w-4 ${value === country.value ? "opacity-100" : "opacity-0"}`}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}