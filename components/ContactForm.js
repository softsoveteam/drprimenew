"use client";

import { useState, useEffect } from "react";
import { useContactFormFields, useSubmitContactForm } from "@/hooks/usePublicContactForm";
import { Loader2 } from "lucide-react";

// Default fallback fields if none configured in backend yet
const DEFAULT_FALLBACK_FIELDS = [
  {
    id: "fallback-1",
    label: "Full Name",
    field_key: "full_name",
    field_type: "text",
    placeholder: "Enter your full name",
    is_required: true,
  },
  {
    id: "fallback-2",
    label: "Email Address",
    field_key: "email",
    field_type: "email",
    placeholder: "you@example.com",
    is_required: true,
  },
  {
    id: "fallback-3",
    label: "Subject",
    field_key: "subject",
    field_type: "text",
    placeholder: "How can we help?",
    is_required: true,
  },
  {
    id: "fallback-4",
    label: "Message",
    field_key: "message",
    field_type: "textarea",
    placeholder: "Write your message here...",
    is_required: true,
  },
];

export default function ContactForm() {
  const { data: apiFields = [], isLoading: isFieldsLoading } = useContactFormFields();
  const submitMutation = useSubmitContactForm();

  const activeFields = apiFields.length > 0 ? apiFields : DEFAULT_FALLBACK_FIELDS;

  const [formData, setFormData] = useState({});
  const [note, setNote] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Initialize form state
  useEffect(() => {
    if (activeFields.length > 0) {
      const initial = {};
      activeFields.forEach((field) => {
        initial[field.field_key] = field.field_type === "checkbox" ? false : "";
      });
      setFormData(initial);
    }
  }, [apiFields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNote("");

    // Validate required fields
    for (const field of activeFields) {
      if (field.is_required) {
        const val = formData[field.field_key];
        if (field.field_type === "checkbox" && !val) {
          setNote(`Please check the required box for "${field.label}".`);
          return;
        }
        if (field.field_type !== "checkbox" && (!val || String(val).trim() === "")) {
          setNote(`Please fill in the required field: "${field.label}".`);
          return;
        }
      }
    }

    submitMutation.mutate(
      { fields: formData },
      {
        onSuccess: () => {
          setSubmittedSuccess(true);
          setNote("Message sent successfully!");
          // Reset form fields
          const resetState = {};
          activeFields.forEach((f) => {
            resetState[f.field_key] = f.field_type === "checkbox" ? false : "";
          });
          setFormData(resetState);
          setTimeout(() => {
            setSubmittedSuccess(false);
            setNote("");
          }, 4000);
        },
        onError: (err) => {
          setNote(err?.message || "Failed to submit message. Please try again.");
        },
      }
    );
  };

  if (isFieldsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1d1c50]" />
        <p className="text-sm text-[#4a4a6a]">Loading contact form...</p>
      </div>
    );
  }

  return (
    <form className="wow fadeInUp" onSubmit={handleSubmit} data-wow-delay="0.2s">
      <div className="row">
        {activeFields.map((field) => {
          const isFullWidth = field.field_type === "textarea" || field.field_type === "checkbox";
          const colClass = isFullWidth ? "col-md-12 mb-4" : "col-md-12 mb-4";

          // Parse options if select type
          let optionsArray = [];
          if (field.field_type === "select") {
            if (Array.isArray(field.options)) {
              optionsArray = field.options;
            } else if (typeof field.options === "string") {
              try {
                optionsArray = JSON.parse(field.options);
              } catch {
                optionsArray = field.options.split(",").map((o) => o.trim());
              }
            }
          }

          return (
            <div key={field.field_key || field.id} className={`form-group ${colClass}`}>
              <label className="text-xs font-semibold text-[#1d1c50] uppercase tracking-wider mb-1.5 block">
                {field.label} {field.is_required && <span className="text-red-500">*</span>}
              </label>

              {field.field_type === "textarea" ? (
                <textarea
                  name={field.field_key}
                  className="form-control"
                  rows="4"
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  value={formData[field.field_key] || ""}
                  onChange={(e) => handleChange(field.field_key, e.target.value)}
                  required={field.is_required}
                />
              ) : field.field_type === "select" ? (
                <select
                  name={field.field_key}
                  className="form-control"
                  value={formData[field.field_key] || ""}
                  onChange={(e) => handleChange(field.field_key, e.target.value)}
                  required={field.is_required}
                >
                  <option value="">{field.placeholder || `-- Select ${field.label} --`}</option>
                  {optionsArray.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.field_type === "checkbox" ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`checkbox-${field.field_key}`}
                    checked={!!formData[field.field_key]}
                    onChange={(e) => handleChange(field.field_key, e.target.checked)}
                    required={field.is_required}
                    className="w-4 h-4 text-[#1d1c50] rounded focus:ring-[#1d1c50]"
                  />
                  <label htmlFor={`checkbox-${field.field_key}`} className="text-sm text-[#4a4a6a] cursor-pointer">
                    {field.placeholder || field.label}
                  </label>
                </div>
              ) : (
                <input
                  type={
                    field.field_type === "email"
                      ? "email"
                      : field.field_type === "number"
                      ? "number"
                      : field.field_type === "phone"
                      ? "tel"
                      : field.field_type === "date"
                      ? "date"
                      : "text"
                  }
                  name={field.field_key}
                  className="form-control"
                  placeholder={field.placeholder || `Enter ${field.label}`}
                  value={formData[field.field_key] || ""}
                  onChange={(e) => handleChange(field.field_key, e.target.value)}
                  required={field.is_required}
                />
              )}
            </div>
          );
        })}

        <div className="col-md-12 mt-2">
          <p className="dp-required-note">* Indicates required field</p>
          {note ? (
            <p className={`dp-form-note ${submittedSuccess ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}`}>
              {note}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn-default flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#c9b896]" />
                <span>SUBMITTING...</span>
              </>
            ) : submittedSuccess ? (
              <span>SUBMITTED!</span>
            ) : (
              <span>SUBMIT</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
