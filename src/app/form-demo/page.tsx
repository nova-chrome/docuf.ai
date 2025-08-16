"use client";

import { useCallback } from "react";
import { FormRenderer } from "~/features/form-renderer/components/form-renderer";
import {
  FormData,
  FormSchema,
} from "~/features/form-renderer/types/form-schema.types";

// Example form schema that demonstrates all field types
const exampleFormSchema: FormSchema = {
  id: "example-form",
  title: "Contact Information",
  description: "Please fill out your contact information below.",
  fields: [
    {
      id: "fullName",
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
      description: "Your first and last name",
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "john@example.com",
      description: "We'll use this to contact you",
    },
    {
      id: "age",
      name: "age",
      label: "Age",
      type: "number",
      required: true,
      min: 18,
      max: 120,
      description: "You must be 18 or older",
    },
    {
      id: "bio",
      name: "bio",
      label: "Biography",
      type: "textarea",
      placeholder: "Tell us about yourself...",
      rows: 9,
      description: "Optional biography",
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
        { label: "Germany", value: "de" },
        { label: "France", value: "fr" },
      ],
    },
    {
      id: "experience",
      name: "experience",
      label: "Experience Level",
      type: "radio",
      required: true,
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
        { label: "Expert", value: "expert" },
      ],
    },
    {
      id: "newsletter",
      name: "newsletter",
      label: "Subscribe to newsletter",
      type: "checkbox",
      description: "Receive updates about new features and content",
    },
    {
      id: "notifications",
      name: "notifications",
      label: "Enable notifications",
      type: "switch",
      description: "Get notified about important updates",
    },
    {
      id: "birthDate",
      name: "birthDate",
      label: "Birth Date",
      type: "date",
      placeholder: "Select your birth date",
      description: "This helps us personalize your experience",
    },
  ],
};

export default function FormRendererDemoPage() {
  const handleSubmit = useCallback((data: FormData) => {
    console.log("Form submitted with data:", data);
    alert("Form submitted! Check the console for the data.");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Form Renderer Example
          </h1>
          <p className="mt-2 text-gray-600">
            This demonstrates the form renderer with all supported field types
          </p>
        </div>

        <FormRenderer
          schema={exampleFormSchema}
          onSubmit={handleSubmit}
          submitButtonText="Submit Form"
        />
      </div>
    </div>
  );
}
