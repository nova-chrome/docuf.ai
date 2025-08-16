export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "date";

export interface SelectOption {
  label: string;
  value: string;
}

export interface BaseFieldSchema {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
}

export interface TextFieldSchema extends BaseFieldSchema {
  type: "text" | "email";
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: "textarea";
  rows?: number;
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: "select";
  options: SelectOption[];
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: "checkbox";
}

export interface RadioFieldSchema extends BaseFieldSchema {
  type: "radio";
  options: SelectOption[];
}

export interface SwitchFieldSchema extends BaseFieldSchema {
  type: "switch";
}

export interface DateFieldSchema extends BaseFieldSchema {
  type: "date";
}

export type FieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | TextareaFieldSchema
  | SelectFieldSchema
  | CheckboxFieldSchema
  | RadioFieldSchema
  | SwitchFieldSchema
  | DateFieldSchema;

export interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  fields: FieldSchema[];
}

export type FormData = Record<string, unknown>;
