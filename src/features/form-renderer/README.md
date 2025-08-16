# Form Renderer

A powerful, type-safe form renderer that generates forms from JSON schemas using TanStack Form and Shadcn UI components.

## Features

- 🎯 **Type-safe**: Full TypeScript support with strict typing
- 📱 **Responsive**: Mobile-first design with responsive layouts
- 🎨 **Consistent**: Uses Shadcn UI components for consistent styling
- ⚡ **Fast**: Built with TanStack Form for optimal performance
- 🔧 **Flexible**: Supports all common form field types
- ♿ **Accessible**: Built with accessibility best practices

## Supported Field Types

- **Text** - Single-line text input
- **Email** - Email input with validation
- **Number** - Numeric input with min/max constraints
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Boolean checkbox
- **Radio** - Radio button groups
- **Switch** - Toggle switch
- **Date** - Date picker with calendar

## Quick Start

### Basic Usage

```tsx
import { FormRenderer, type FormSchema } from "~/features/form-renderer";

const schema: FormSchema = {
  id: "my-form",
  title: "Contact Form",
  description: "Please fill out your information",
  fields: [
    {
      id: "name",
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your name",
    },
    {
      id: "email",
      name: "email", 
      label: "Email",
      type: "email",
      required: true,
      placeholder: "your@email.com",
    },
  ],
};

function MyForm() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <FormRenderer
      schema={schema}
      onSubmit={handleSubmit}
      submitButtonText="Submit"
    />
  );
}
```

### Advanced Example

```tsx
const advancedSchema: FormSchema = {
  id: "user-profile",
  title: "User Profile",
  description: "Create your user profile",
  fields: [
    {
      id: "username",
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      placeholder: "Choose a username",
      description: "This will be your unique identifier",
    },
    {
      id: "age",
      name: "age",
      label: "Age",
      type: "number",
      required: true,
      min: 13,
      max: 120,
      description: "Must be 13 or older",
    },
    {
      id: "country",
      name: "country",
      label: "Country",
      type: "select",
      required: true,
      placeholder: "Select your country",
      options: [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
        { label: "United Kingdom", value: "uk" },
      ],
    },
    {
      id: "bio",
      name: "bio",
      label: "Biography",
      type: "textarea",
      placeholder: "Tell us about yourself...",
      rows: 4,
    },
    {
      id: "skills",
      name: "skills",
      label: "Experience Level",
      type: "radio",
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
    },
    {
      id: "newsletter",
      name: "newsletter",
      label: "Subscribe to newsletter",
      type: "checkbox",
      description: "Get updates about new features",
    },
    {
      id: "notifications",
      name: "notifications",
      label: "Enable notifications",
      type: "switch",
      defaultValue: true,
    },
    {
      id: "birthDate",
      name: "birthDate",
      label: "Birth Date",
      type: "date",
      placeholder: "Select your birth date",
    },
  ],
};
```

## API Reference

### FormRenderer Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `schema` | `FormSchema` | ✅ | The form schema definition |
| `onSubmit` | `(data: FormData) => void` | ✅ | Callback when form is submitted |
| `defaultValues` | `FormData` | ❌ | Default form values |
| `submitButtonText` | `string` | ❌ | Submit button text (default: "Submit") |
| `className` | `string` | ❌ | Custom CSS classes for the form |

### FormSchema

```typescript
interface FormSchema {
  id: string;                    // Unique form identifier
  title?: string;               // Optional form title
  description?: string;         // Optional form description
  fields: FieldSchema[];        // Array of field definitions
}
```

### FieldSchema Types

#### Base Field Properties

All fields share these common properties:

```typescript
interface BaseFieldSchema {
  id: string;                   // Unique field identifier
  name: string;                 // Form field name (for form data)
  label: string;               // Display label
  type: FieldType;             // Field type
  required?: boolean;          // Whether field is required
  placeholder?: string;        // Placeholder text
  description?: string;        // Help text
  defaultValue?: unknown;      // Default value
}
```

#### Text Field

```typescript
interface TextFieldSchema extends BaseFieldSchema {
  type: "text" | "email";
}
```

#### Number Field

```typescript
interface NumberFieldSchema extends BaseFieldSchema {
  type: "number";
  min?: number;                // Minimum value
  max?: number;                // Maximum value  
  step?: number;               // Step increment
}
```

#### Textarea Field

```typescript
interface TextareaFieldSchema extends BaseFieldSchema {
  type: "textarea";
  rows?: number;               // Number of rows
}
```

#### Select Field

```typescript
interface SelectFieldSchema extends BaseFieldSchema {
  type: "select";
  options: SelectOption[];     // Dropdown options
}

interface SelectOption {
  label: string;               // Display text
  value: string;               // Option value
}
```

#### Radio Field

```typescript
interface RadioFieldSchema extends BaseFieldSchema {
  type: "radio";
  options: SelectOption[];     // Radio options
}
```

#### Checkbox Field

```typescript
interface CheckboxFieldSchema extends BaseFieldSchema {
  type: "checkbox";
}
```

#### Switch Field

```typescript
interface SwitchFieldSchema extends BaseFieldSchema {
  type: "switch";
}
```

#### Date Field

```typescript
interface DateFieldSchema extends BaseFieldSchema {
  type: "date";
}
```

## Validation

The form renderer includes built-in validation for:

- **Required fields**: Shows error if field is empty and required
- **Email validation**: Validates email format
- **Number constraints**: Enforces min/max values for number fields
- **Type safety**: Ensures correct data types

Custom validation can be added by extending the validation schema utilities.

## Styling

The form renderer uses Tailwind CSS classes and follows the Shadcn UI design system. You can customize the appearance by:

1. **Custom className**: Pass a custom className to the FormRenderer
2. **CSS variables**: Modify the CSS custom properties used by Shadcn UI
3. **Component overrides**: Create custom field components if needed

## Integration with PDF Forms

This form renderer is designed to work seamlessly with PDF form extraction. When you extract form fields from a PDF, you can map them to the FormSchema format:

```typescript
// Example: Converting PDF form field to FormSchema field
const pdfField = {
  name: "customerName",
  type: "text",
  required: true,
  // ... other PDF field properties
};

const formField: FieldSchema = {
  id: pdfField.name,
  name: pdfField.name,
  label: "Customer Name", // Human-readable label
  type: "text",
  required: pdfField.required,
  placeholder: "Enter customer name",
};
```

## Accessibility

The form renderer includes comprehensive accessibility features:

- **Semantic HTML**: Uses proper form elements and structure
- **ARIA labels**: Includes appropriate ARIA attributes
- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Compatible with screen readers
- **Error announcements**: Errors are announced to assistive technology
- **Focus management**: Proper focus handling throughout the form

## Performance

- **Optimized rendering**: Only re-renders changed fields
- **Lazy evaluation**: Field validation occurs on demand
- **Memory efficient**: Minimal memory footprint
- **Fast form submission**: Efficient data collection and submission
