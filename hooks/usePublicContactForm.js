"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { publicContactFormService } from "@/services/public-contact-form.service";
import toast from "react-hot-toast";

/**
 * Hook to fetch active contact form fields configured by admin
 * Corresponds to USER API spec 4.1: GET /contact-form/fields
 */
export function useContactFormFields(options = {}) {
  return useQuery({
    queryKey: ["contact-form-fields"],
    queryFn: async () => {
      const response = await publicContactFormService.getFields();
      // response unwrap gives { success, message, data: { fields: [...] } }
      const fields = response?.data?.fields || response?.fields || response?.data || [];
      // Return fields sorted by sort_order
      return [...fields].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
}

/**
 * Hook to submit dynamic contact form
 * Corresponds to USER API spec 4.2: POST /contact-form/submit
 */
export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async (payload) => {
      return await publicContactFormService.submitForm(payload);
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Contact form submitted successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to submit contact form. Please check your entries.");
    },
  });
}
