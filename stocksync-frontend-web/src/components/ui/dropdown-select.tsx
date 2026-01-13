"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DropdownSelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

type DropdownSelectProps = {
  value: string;
  onValueChangeAction: (value: string) => void;
  options: DropdownSelectOption[];

  placeholder?: React.ReactNode;
  menuLabel?: React.ReactNode;

  name?: string;
  disabled?: boolean;

  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"];

  className?: string;
  contentClassName?: string;

  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
};

export function DropdownSelect({
  value,
  onValueChangeAction,
  options,
  placeholder = "Select…",
  menuLabel,
  name,
  disabled,
  align = "start",
  side,
  className,
  contentClassName,
  buttonVariant = "outline",
  buttonSize = "default",
}: DropdownSelectProps) {
  const selected = options.find(o => o.value === value);
  const triggerLabel = selected?.label ?? placeholder;

  return (
    <DropdownMenu>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={buttonVariant}
          size={buttonSize}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        side={side}
        className={cn("min-w-56", contentClassName)}
      >
        {menuLabel ? <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel> : null}
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChangeAction}>
          {options.map(option => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
