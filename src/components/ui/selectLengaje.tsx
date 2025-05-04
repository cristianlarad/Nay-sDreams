"use client";

import * as React from "react";
import { Check } from "lucide-react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const Leng = [
  {
    value: "es-ES",
    label: "Español",
    flag: "fi fi-es", // Bandera de España
  },
  {
    value: "en-US",
    label: "English",
    flag: "fi fi-us", // Bandera de Estados Unidos
  },
];

export function SelectLenguaje() {
  const [open, setOpen] = React.useState(false);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between cursor-pointer"
          variant="ghost"
        >
          <div className="flex items-center gap-2">
            <span
              className={
                Leng.find((f) => f.value === currentLanguage)?.flag || ""
              }
            ></span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder={t("search.language")} />
          <CommandList>
            <CommandEmpty>{t("no.language.found")}</CommandEmpty>
            <CommandGroup>
              {Leng.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={() => changeLanguage(framework.value)}
                >
                  <div className="flex items-center gap-2">
                    <span className={framework.flag}></span>
                    {framework.label}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentLanguage === framework.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
