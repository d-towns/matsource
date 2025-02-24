"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { carModels } from "@/utils/carData"

interface ModelsComboboxProps {
  make: string;
  onSelect: (value: string) => void;
}

export function ModelsCombobox({ make, onSelect }: ModelsComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // Reset value when make changes
  React.useEffect(() => {
    setValue("");
  }, [make]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[275px] justify-between text-muted-foreground"
          disabled={!make} // Disable if no make is selected
        >
          {value
            ? carModels.find((model) => model.value === value)?.label
            : "Select Model..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="F-150, Camaro, etc." className="h-9" />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {carModels
                .filter((model) => model.make === make)
                .map((model) => (
                  <CommandItem
                    key={model.value}
                    value={model.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      onSelect(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {model.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === model.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
