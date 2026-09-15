"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useContactFormFields, useSubmitContactForm } from "@/hooks/usePublicContactForm";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

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

/**
 * Dynamically construct Zod schema based on active fields array
 */
function buildZodSchema(fields) {
  const shape = {};

  fields.forEach((field) => {
    const key = field.field_key;
    const isRequired = field.is_required;
    const label = field.label || key;

    if (field.field_type === "checkbox") {
      let schema = z.boolean();
      if (isRequired) {
        schema = schema.refine((val) => val === true, {
          message: `Please check ${label}`,
        });
      }
      shape[key] = schema;
    } else if (field.field_type === "email") {
      let schema = z.string();
      if (isRequired) {
        schema = schema
          .min(1, `${label} is required`)
          .email("Please enter a valid email address");
      } else {
        schema = schema.optional().refine(
          (val) => !val || z.string().email().safeParse(val).success,
          { message: "Please enter a valid email address" }
        );
      }
      shape[key] = schema;
    } else {
      let schema = z.string();
      if (isRequired) {
        schema = schema.min(1, `${label} is required`);
      } else {
        schema = schema.optional();
      }
      shape[key] = schema;
    }
  });

  return z.object(shape);
}

export default function ContactForm({ initialFields = [] }) {
  const { data: apiFields = [], isLoading: isFieldsLoading } = useContactFormFields({
    initialData: initialFields.length > 0 ? initialFields : undefined,
  });
  const submitMutation = useSubmitContactForm();

  const activeFields = useMemo(() => {
    return apiFields.length > 0 ? apiFields : initialFields.length > 0 ? initialFields : DEFAULT_FALLBACK_FIELDS;
  }, [apiFields, initialFields]);

  // Construct dynamic Zod schema whenever activeFields changes
  const validationSchema = useMemo(() => buildZodSchema(activeFields), [activeFields]);

  // Default values generator
  const defaultValues = useMemo(() => {
    const defaults = {};
    activeFields.forEach((field) => {
      defaults[field.field_key] = field.field_type === "checkbox" ? false : "";
    });
    return defaults;
  }, [activeFields]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onTouched",
  });

  // Re-reset default values if fields finish loading
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const [note, setNote] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const onSubmit = (data) => {
    setNote("");
    setSubmittedSuccess(false);

    submitMutation.mutate(
      { fields: data },
      {
        onSuccess: () => {
          setSubmittedSuccess(true);
          setNote("Message sent successfully! We will get back to you within 24 hours.");
          reset(defaultValues);
          setTimeout(() => {
            setSubmittedSuccess(false);
            setNote("");
          }, 5000);
        },
        onError: (err) => {
          setNote(err?.message || "Failed to submit message. Please try again.");
        },
      }
    );
  };

  if (isFieldsLoading && activeFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-sm text-white/80 font-medium">Loading contact form...</p>
      </div>
    );
  }

  return (
    <form className="wow fadeInUp space-y-4" onSubmit={handleSubmit(onSubmit)} data-wow-delay="0.2s" noValidate>
      <div className="row">
        {activeFields.map((field) => {
          const isFullWidth = field.field_type === "textarea" || field.field_type === "checkbox";
          const colClass = isFullWidth ? "col-md-12 mb-4" : "col-md-12 mb-4";
          const fieldError = errors[field.field_key]?.message;

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
              {/* Field Label in Crisp White */}
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block !text-white" style={{ color: "#ffffff" }}>
                {field.label} {field.is_required && <span className="text-[#c9b896] ml-0.5">*</span>}
              </label>

              {field.field_type === "textarea" ? (
                <textarea
                  {...register(field.field_key)}
                  style={{ color: "#1d1c50", backgroundColor: "#ffffff" }}
                  className={`w-full bg-white text-[#1d1c50] border ${fieldError ? "border-rose-400 focus:ring-rose-400" : "border-[#1d1c50]/20 focus:ring-[#c9b896]"
                    } rounded-2xl p-4 text-sm font-medium placeholder:text-[#4a4a6a]/60 focus:outline-none focus:ring-2 shadow-sm transition-all`}
                  rows="4"
                  placeholder={field.placeholder || `Enter ${field.label}`}
                />
              ) : field.field_type === "select" ? (
                <div className="relative">
                  <select
                    {...register(field.field_key)}
                    style={{ color: "#1d1c50", backgroundColor: "#ffffff" }}
                    className={`w-full bg-white text-[#1d1c50] border ${fieldError ? "border-rose-400 focus:ring-rose-400" : "border-[#1d1c50]/20 focus:ring-[#c9b896]"
                      } rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 shadow-sm cursor-pointer transition-all`}
                  >
                    <option value="" style={{ color: "#1d1c50", backgroundColor: "#ffffff" }}>
                      {field.placeholder || `-- Select ${field.label} --`}
                    </option>
                    {optionsArray.map((opt, idx) => (
                      <option key={idx} value={opt} style={{ color: "#1d1c50", backgroundColor: "#ffffff" }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ) : field.field_type === "checkbox" ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`checkbox-${field.field_key}`}
                    {...register(field.field_key)}
                    className="w-4 h-4 text-[#1d1c50] rounded focus:ring-[#c9b896] cursor-pointer"
                  />
                  <label htmlFor={`checkbox-${field.field_key}`} className="text-sm !text-white/90 cursor-pointer select-none" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
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
                  {...register(field.field_key)}
                  style={{ color: "#1d1c50", backgroundColor: "#ffffff" }}
                  className={`w-full bg-white text-[#1d1c50] border ${fieldError ? "border-rose-400 focus:ring-rose-400" : "border-[#1d1c50]/20 focus:ring-[#c9b896]"
                    } rounded-2xl px-4 py-3.5 text-sm font-medium placeholder:text-[#4a4a6a]/60 focus:outline-none focus:ring-2 shadow-sm transition-all`}
                  placeholder={field.placeholder || `Enter ${field.label}`}
                />
              )}

              {/* Inline Validation Error Message */}
              {fieldError && (
                <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1.5" style={{ color: "#fb7185" }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldError}</span>
                </p>
              )}
            </div>
          );
        })}

        <div className="col-md-12 mt-2 space-y-3">
          <p className="dp-required-note text-xs !text-white/80 font-medium" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            * Indicates required field
          </p>

          {note && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${submittedSuccess
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-400/30 text-rose-300"
                }`}
            >
              {submittedSuccess ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{note}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: "8px",
              paddingRight: "20px",
            }}
            className="btn-default !inline-flex !items-center !justify-center gap-2 cursor-pointer disabled:opacity-50 w-full font-bold uppercase tracking-wider"
            disabled={submitMutation.isPending || isSubmitting}
          >
            {submitMutation.isPending || isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#1d1c50] shrink-0" />
                <span className="whitespace-nowrap">SUBMITTING...</span>
              </span>
            ) : submittedSuccess ? (
              <span className="whitespace-nowrap">SUBMITTED!</span>
            ) : (
              <span className="whitespace-nowrap">SUBMIT</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
