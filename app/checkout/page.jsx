"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useUserStore } from "@/lib/store/useUserStore";
import { createCheckout } from "@/services/checkout.service";
import { useAddresses } from "@/hooks/useAddresses";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SHIPPING_STORAGE_PREFIX = "checkout_shipping_";

const shippingSchema = z.object({
  label: z.string().trim().max(50).optional().or(z.literal("")),
  shipping_name: z.string().trim().min(1, "Name is required").max(255),
  shipping_address_line1: z.string().trim().min(1, "Street address is required").max(255),
  shipping_address_line2: z.string().trim().max(255).optional().or(z.literal("")),
  shipping_city: z.string().trim().min(1, "City is required").max(255),
  shipping_state: z.string().trim().min(1, "State is required").max(255),
  shipping_postal_code: z.string().trim().min(1, "Postal code is required").max(20),
  shipping_country: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code, such as US")
    .regex(/^[A-Za-z]{2}$/, "Use a 2-letter country code, such as US"),
  shipping_phone: z.string().trim().max(30).optional().or(z.literal("")),
  save_address: z.boolean().optional(),
  is_default: z.boolean().optional(),
});

function saveShippingForOrder(orderId, shipping) {
  if (typeof window === "undefined" || !orderId) return;
  sessionStorage.setItem(`${SHIPPING_STORAGE_PREFIX}${orderId}`, JSON.stringify(shipping));
}

function formatPrice(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return String(price ?? "");
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMessage("");

    const returnUrl = `${window.location.origin}/order-confirmation?order=${orderId}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }

    router.push(`/order-confirmation?order=${orderId}`);
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <PaymentElement />
      {errorMessage && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing…
          </>
        ) : (
          "Pay now"
        )}
      </button>
      <p className="text-[11px] text-center text-[#4a4a6a]">
        Test card: 4242 4242 4242 4242 · any future expiry · any CVC
      </p>
    </form>
  );
}

function ShippingForm({ onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      label: "",
      shipping_name: "",
      shipping_address_line1: "",
      shipping_address_line2: "",
      shipping_city: "",
      shipping_state: "",
      shipping_postal_code: "",
      shipping_country: "US",
      shipping_phone: "",
      save_address: false,
      is_default: false,
    },
  });
  const saveAddress = watch("save_address");

  const field = (name, label, props = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs">
        {label}
      </Label>
      <Input id={name} {...register(name)} {...props} />
      {errors[name] && (
        <p className="text-[11px] text-rose-500 font-medium">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {saveAddress && field("label", "Label (Home, Office)", { maxLength: 50 })}
      {field("shipping_name", "Full name", { autoComplete: "name" })}
      {field("shipping_address_line1", "Street address", { autoComplete: "address-line1" })}
      {field("shipping_address_line2", "Apartment, suite (optional)", {
        autoComplete: "address-line2",
      })}
      <div className="grid grid-cols-2 gap-3">
        {field("shipping_city", "City", { autoComplete: "address-level2" })}
        {field("shipping_state", "State", { autoComplete: "address-level1" })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("shipping_postal_code", "Postal code", {
          autoComplete: "postal-code",
          maxLength: 20,
        })}
        {field("shipping_country", "Country", {
          autoComplete: "country",
          maxLength: 2,
          className: "uppercase",
        })}
      </div>
      {field("shipping_phone", "Phone (optional)", {
        autoComplete: "tel",
        maxLength: 30,
      })}
      <label className="flex items-center gap-2 text-sm text-[#1d1c50]">
        <input type="checkbox" className="accent-[#1d1c50]" {...register("save_address")} />
        Save this address
      </label>
      {saveAddress && (
        <label className="flex items-center gap-2 text-sm text-[#1d1c50]">
          <input type="checkbox" className="accent-[#1d1c50]" {...register("is_default")} />
          Use as default
        </label>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Starting checkout…
          </>
        ) : (
          "Continue to payment"
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const [checkout, setCheckout] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [initError, setInitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses(
    Boolean(isAuthenticated || token)
  );

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    if (selectedId || addresses.length === 0) return;
    const preferred = addresses.find((address) => address.is_default) || addresses[0];
    if (preferred) setSelectedId(preferred.id);
  }, [addresses, selectedId]);

  const startCheckout = async (values) => {
    setInitError("");
    setSubmitting(true);
    const saved = !useNewAddress && selectedId;
    const shipping = saved
      ? { address_id: selectedId }
      : {
          shipping_name: values.shipping_name.trim(),
          shipping_address_line1: values.shipping_address_line1.trim(),
          shipping_city: values.shipping_city.trim(),
          shipping_state: values.shipping_state.trim(),
          shipping_postal_code: values.shipping_postal_code.trim(),
          shipping_country: values.shipping_country.trim().toUpperCase(),
          save_address: Boolean(values.save_address),
          is_default: Boolean(values.save_address && values.is_default),
        };
    if (!saved) {
      if (values.label?.trim()) shipping.label = values.label.trim();
      if (values.shipping_address_line2?.trim()) {
        shipping.shipping_address_line2 = values.shipping_address_line2.trim();
      }
      if (values.shipping_phone?.trim()) {
        shipping.shipping_phone = values.shipping_phone.trim();
      }
    }

    try {
      const data = await createCheckout(shipping);
      const payload = data?.order ? data : data?.data || data;
      const order = payload?.order;
      const payment = payload?.payment;

      if (!order?.id || !payment?.client_secret || !payment?.publishable_key) {
        throw new Error("Checkout response was incomplete. Check Stripe settings.");
      }

      saveShippingForOrder(order.id, order.shipping || shipping);
      setCheckout({ order, payment });
      setStripePromise(loadStripe(payment.publishable_key));
    } catch (err) {
      const msg = err?.message || "Could not start checkout";
      setInitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated && !token) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
      </main>
    );
  }

  if (!checkout && initError && /already|processing|paid/i.test(initError)) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed]">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#1d1c50]/10 p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-[#1d1c50]">Checkout unavailable</h1>
          <p className="text-sm text-[#4a4a6a]">{initError}</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/orders"
              className="py-2.5 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold"
            >
              View my orders
            </Link>
            <Link href="/cart" className="text-sm font-semibold text-[#1d1c50]">
              Back to cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!checkout) {
    return (
      <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
        <div className="max-w-lg mx-auto space-y-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to cart
          </Link>
          <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1d1c50] font-serif">Shipping</h1>
              <p className="text-sm text-[#4a4a6a] mt-1">
                This address is used to ship your order.
              </p>
            </div>
            {initError && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {initError}
              </p>
            )}
            {addressesLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-[#1d1c50]" />
              </div>
            ) : (
              <>
                {addresses.length > 0 && (
                  <div className="space-y-2">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex gap-3 rounded-2xl border p-3 text-sm cursor-pointer ${
                          !useNewAddress && selectedId === address.id
                            ? "border-[#1d1c50] bg-[#f8f5ed]"
                            : "border-[#1d1c50]/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name="saved-address"
                          className="mt-1 accent-[#1d1c50]"
                          checked={!useNewAddress && selectedId === address.id}
                          onChange={() => {
                            setUseNewAddress(false);
                            setSelectedId(address.id);
                          }}
                        />
                        <span className="text-[#4a4a6a]">
                          <span className="font-semibold text-[#1d1c50] block">
                            {address.label || address.name}
                            {address.is_default ? " · Default" : ""}
                          </span>
                          {address.address_line1}, {address.city}, {address.state}{" "}
                          {address.postal_code}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 text-sm text-[#1d1c50]">
                      <input
                        type="radio"
                        name="saved-address"
                        className="accent-[#1d1c50]"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                      />
                      Use a new address
                    </label>
                  </div>
                )}
                {(addresses.length === 0 || useNewAddress) && (
                  <ShippingForm onSubmit={startCheckout} submitting={submitting} />
                )}
                {addresses.length > 0 && !useNewAddress && (
                  <button
                    type="button"
                    disabled={submitting || !selectedId}
                    onClick={() => startCheckout()}
                    className="w-full py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] disabled:opacity-60"
                  >
                    {submitting ? "Starting checkout…" : "Continue to payment"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

  const { order, payment } = checkout;

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-lg mx-auto space-y-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>

        <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1c50] font-serif">Checkout</h1>
            <p className="text-sm text-[#4a4a6a] mt-1">
              Order {order.order_number} ·{" "}
              <span className="font-semibold text-[#1d1c50]">
                {formatPrice(order.subtotal, order.currency)}
              </span>
            </p>
          </div>

          {Array.isArray(order.items) && order.items.length > 0 && (
            <ul className="space-y-2 text-sm border-y border-[#1d1c50]/10 py-4">
              {order.items.map((line, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span className="text-[#4a4a6a] truncate">
                    {line.title} × {line.quantity}
                  </span>
                  <span className="font-medium text-[#1d1c50] shrink-0">
                    {formatPrice(line.line_total, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {stripePromise && payment.client_secret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: payment.client_secret,
                appearance: {
                  theme: "stripe",
                  variables: { colorPrimary: "#1d1c50" },
                },
              }}
            >
              <CheckoutForm orderId={order.id} />
            </Elements>
          )}
        </div>
      </div>
    </main>
  );
}
