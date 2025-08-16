"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import type {
  CheckboxFieldSchema,
  DateFieldSchema,
  NumberFieldSchema,
  RadioFieldSchema,
  SelectFieldSchema,
  SwitchFieldSchema,
  TextFieldSchema,
  TextareaFieldSchema,
} from "../types/form-schema.types";

interface TextFieldProps {
  field: TextFieldSchema;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function TextField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: TextFieldProps) {
  return (
    <Input
      type={field.type}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={!!error}
    />
  );
}

interface NumberFieldProps {
  field: NumberFieldSchema;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
  error?: string;
}

export function NumberField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: NumberFieldProps) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onBlur={onBlur}
      min={field.min}
      max={field.max}
      step={field.step}
      aria-invalid={!!error}
    />
  );
}

interface TextareaFieldProps {
  field: TextareaFieldSchema;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function TextareaField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: TextareaFieldProps) {
  return (
    <Textarea
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      rows={field.rows}
      aria-invalid={!!error}
    />
  );
}

interface SelectFieldProps {
  field: SelectFieldSchema;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function SelectField({
  field,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-invalid={!!error}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {field.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface CheckboxFieldProps {
  field: CheckboxFieldSchema;
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  error?: string;
}

export function CheckboxField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.id}
        checked={value}
        onCheckedChange={(checked) => onChange(checked === true)}
        onBlur={onBlur}
        aria-invalid={!!error}
      />
      <Label
        htmlFor={field.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {field.label}
      </Label>
    </div>
  );
}

interface RadioFieldProps {
  field: RadioFieldSchema;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function RadioField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: RadioFieldProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      {field.options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`${field.id}-${option.value}`}
            onBlur={onBlur}
            aria-invalid={!!error}
          />
          <Label
            htmlFor={`${field.id}-${option.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

interface SwitchFieldProps {
  field: SwitchFieldSchema;
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  error?: string;
}

export function SwitchField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: SwitchFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={field.id}
        checked={value}
        onCheckedChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
      />
      <Label
        htmlFor={field.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {field.label}
      </Label>
    </div>
  );
}

interface DateFieldProps {
  field: DateFieldSchema;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  onBlur: () => void;
  error?: string;
}

export function DateField({
  field,
  value,
  onChange,
  onBlur,
  error,
}: DateFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
          aria-invalid={!!error}
          onBlur={onBlur}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : field.placeholder || "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
