"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Loader2, Pencil, Trash2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddresses, useAddressMutations } from "@/hooks/useAddresses";

const schema = z.object({
  label: z.string().trim().max(50).optional().or(z.literal("")),
  name: z.string().trim().min(1, "Name is required").max(255),
  address_line1: z.string().trim().min(1, "Street address is required").max(255),
  address_line2: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(255),
  state: z.string().trim().min(1, "State is required").max(255),
  postal_code: z.string().trim().min(1, "Postal code is required").max(20),
  country: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Use a 2-letter country code, such as US"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  is_default: z.boolean().optional(),
});

const emptyValues = {
  label: "",
  name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "US",
  phone: "",
  is_default: false,
};

function toPayload(values) {
  const payload = {
    name: values.name.trim(),
    address_line1: values.address_line1.trim(),
    city: values.city.trim(),
    state: values.state.trim(),
    postal_code: values.postal_code.trim(),
    country: values.country.trim().toUpperCase(),
    is_default: Boolean(values.is_default),
  };
  if (values.label?.trim()) payload.label = values.label.trim();
  if (values.address_line2?.trim()) payload.address_line2 = values.address_line2.trim();
  if (values.phone?.trim()) payload.phone = values.phone.trim();
  return payload;
}

function AddressFields({ register, errors }) {
  const field = (name, label, props = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`addr-${name}`} className="text-xs">
        {label}
      </Label>
      <Input id={`addr-${name}`} {...register(name)} {...props} />
      {errors[name] && (
        <p className="text-[11px] text-rose-500 font-medium">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {field("label", "Label (Home, Office)", { maxLength: 50 })}
      {field("name", "Full name")}
      {field("address_line1", "Street address")}
      {field("address_line2", "Apartment, suite (optional)")}
      <div className="grid grid-cols-2 gap-3">
        {field("city", "City")}
        {field("state", "State")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("postal_code", "Postal code", { maxLength: 20 })}
        {field("country", "Country", { maxLength: 2, className: "uppercase" })}
      </div>
      {field("phone", "Phone (optional)", { maxLength: 30 })}
      <label className="flex items-center gap-2 text-sm text-[#1d1c50]">
        <input type="checkbox" className="accent-[#1d1c50]" {...register("is_default")} />
        Use as default
      </label>
    </div>
  );
}

export default function AddressBook() {
  const { data: addresses = [], isLoading } = useAddresses();
  const { createAddress, updateAddress, setDefault, removeAddress } = useAddressMutations();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const startNew = () => {
    setEditing(null);
    form.reset(emptyValues);
    setOpen(true);
  };

  const startEdit = (address) => {
    setEditing(address);
    form.reset({
      label: address.label || "",
      name: address.name || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "US",
      phone: address.phone || "",
      is_default: Boolean(address.is_default),
    });
    setOpen(true);
  };

  const onSubmit = (values) => {
    const payload = toPayload(values);
    const done = () => {
      setOpen(false);
      setEditing(null);
      form.reset(emptyValues);
    };
    if (editing) {
      updateAddress.mutate({ id: editing.id, payload }, { onSuccess: done });
    } else {
      createAddress.mutate(payload, { onSuccess: done });
    }
  };

  const busy = createAddress.isPending || updateAddress.isPending;

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#1d1c50]/10">
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[#1d1c50]/10">
        <h2 className="text-lg font-bold text-[#1d1c50] !mb-0 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#c9b896]" />
          Shipping addresses
        </h2>
        <button
          type="button"
          onClick={startNew}
          className="text-xs font-semibold text-[#1d1c50] hover:text-[#c9b896]"
        >
          Add address
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-[#1d1c50]" />
        </div>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-[#4a4a6a]">No saved addresses yet.</p>
      ) : (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-2xl border border-[#1d1c50]/10 p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
            >
              <div className="text-sm text-[#4a4a6a] min-w-0">
                <p className="font-semibold text-[#1d1c50]">
                  {address.label || "Address"}
                  {address.is_default && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-[#c9b896]">
                      Default
                    </span>
                  )}
                </p>
                <p>{address.name}</p>
                <p>
                  {address.address_line1}
                  {address.address_line2 ? `, ${address.address_line2}` : ""}
                </p>
                <p>
                  {[address.city, address.state, address.postal_code].filter(Boolean).join(", ")}{" "}
                  {address.country}
                </p>
                {address.phone && <p>{address.phone}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!address.is_default && (
                  <button
                    type="button"
                    onClick={() => setDefault.mutate(address.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1d1c50]"
                  >
                    <Star className="w-3.5 h-3.5" /> Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(address)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1d1c50]"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeAddress.mutate(address.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4 border-t border-[#1d1c50]/10 pt-5">
          <p className="text-sm font-semibold text-[#1d1c50]">
            {editing ? "Edit address" : "New address"}
          </p>
          <AddressFields register={form.register} errors={form.formState.errors} />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2.5 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1d1c50]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
