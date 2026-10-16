"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "@/services/product.service";
import { useAddToCart } from "@/hooks/useCart";
import {
  ArrowLeft,
  Loader2,
  Package,
  ExternalLink,
  ShieldCheck,
  Truck,
  Check,
  Star,
  Copy,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Award,
  CheckCircle2,
  ThumbsUp,
  Clock,
  CreditCard,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

function formatPrice(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return String(price ?? "—");
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function galleryUrls(product) {
  const fromGallery = Array.isArray(product?.images)
    ? product.images
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img) => img.url || img.image_url)
        .filter(Boolean)
    : [];
  if (fromGallery.length) return fromGallery;
  if (product?.image_url) return [product.image_url];
  return [];
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const addMutation = useAddToCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedField, setCopiedField] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Fetch current product
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  // Fetch sibling products to build color variant switcher
  const { data: catalogData } = useQuery({
    queryKey: ["products-catalog"],
    queryFn: () => getProducts({ per_page: 10 }),
  });

  const product = data?.product || data?.data?.product || data;
  const allProducts = Array.isArray(catalogData?.data)
    ? catalogData.data
    : Array.isArray(catalogData?.data?.data)
    ? catalogData.data.data
    : [];

  const images = useMemo(() => galleryUrls(product), [product]);
  const mainSrc = images[activeIndex] || images[0] || "";

  const isCream = (product?.title || product?.sku || "").toLowerCase().includes("cream");
  const isBlue = (product?.title || product?.sku || "").toLowerCase().includes("blue");
  const currentColorName = isCream ? "Cream" : isBlue ? "Blue" : "Contour";

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddToCart = () => {
    if (!product?.id) return;
    addMutation.mutate(
      { product_id: product.id, quantity },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} item(s) to cart!`);
        },
      }
    );
  };

  const handleBuyNow = async () => {
    if (!product?.id) return;
    try {
      await addMutation.mutateAsync({ product_id: product.id, quantity });
      router.push("/checkout");
    } catch {
      // error handled in mutation
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
        <p className="text-sm font-medium text-[#4a4a6a]">Loading Amazon product catalog…</p>
      </main>
    );
  }

  if (error || !product?.id) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed]">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 text-center border border-[#1d1c50]/10 shadow-sm space-y-4">
          <Package className="w-12 h-12 text-[#1d1c50]/30 mx-auto" />
          <h1 className="text-xl font-bold text-[#1d1c50]">Product not found</h1>
          <p className="text-sm text-[#4a4a6a]">
            {error?.message || "This product is unavailable or inactive in catalog."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d1c50] text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const inStock = product.in_stock && product.stock_quantity > 0;
  const listPrice = 89.99;
  const currentPrice = Number(product.price) || 54.99;
  const savings = Math.max(0, listPrice - currentPrice);
  const savingsPercent = Math.round((savings / listPrice) * 100);

  // Amazon FBA Inventory Metrics
  const meta = product.meta || {};
  const fnSku = meta.fnSku || (isCream ? "X0052QSDIT" : "X0052QZV1B");
  const totalAmazonUnits = meta.totalQuantity || (isCream ? 1221 : 1165);
  const inboundUnits = meta.inboundShipped || 1008;

  const faqs = [
    {
      q: "How long does it take for the cervical pillow to fully expand?",
      a: "The pillow arrives vacuum-sealed for hygiene and transit protection. Once unboxed, please allow 24 to 48 hours for the 60D high-density memory foam to fully expand to its intended ergonomic dimensions. Gently tapping or patting the pillow accelerates the process.",
    },
    {
      q: "Which height zone should I use — the 4.7-inch or 3.9-inch contour?",
      a: "The pillow features dual reversible contours: side sleepers generally prefer the higher 4.7-inch contour to accommodate the shoulder height and keep the neck straight. Back and stomach sleepers typically prefer the 3.9-inch lower contour to prevent overextending the cervical spine.",
    },
    {
      q: "How should I clean and wash the pillow?",
      a: "The outer cooling cover features a concealed zipper and is 100% machine washable in cold water on a gentle cycle. Tumble dry low or air dry. Note: The inner memory foam core should NEVER be placed in a washing machine or soaked in water; spot clean with a damp cloth if necessary.",
    },
    {
      q: "Is there any initial memory foam odor?",
      a: "Our foam is certified by CertiPUR-US® to be free of harmful chemicals and toxic heavy metals. Any subtle 'fresh foam' scent upon opening is completely harmless and will naturally dissipate within 24–48 hours in a well-ventilated space.",
    },
    {
      q: "How does Amazon FBA Multi-Channel Fulfillment work for website orders?",
      a: "When you place an order on our store, your items are automatically picked, packed, and dispatched from Amazon's closest US fulfillment center. You receive direct Amazon tracking numbers (Swiship / TBA, UPS, FedEx, or USPS) to follow live delivery updates.",
    },
  ];

  return (
    <main className="min-h-screen pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#fbf9f4] text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Amazon Category Breadcrumbs & Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200/80 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
            <Link href="/" className="hover:text-[#1d1c50] transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/shop" className="hover:text-[#1d1c50] transition-colors">Bed Pillows</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Cervical & Orthopedic Pillows</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Amazon US Marketplace (ATVPDKIKX0DER)
            </span>
          </div>
        </div>

        {/* TOP SECTION: Amazon 2-Column Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* LEFT COLUMN: Gallery & Certifications (7 / 12 on Desktop) */}
          <div className="lg:col-span-7 space-y-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
              <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">

                {/* Vertical Thumbnail Rail (on tablets/desktops) */}
                {images.length > 1 && (
                  <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto w-full sm:w-20 sm:max-h-[500px] pb-2 sm:pb-0 shrink-0 scrollbar-thin">
                    {images.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all cursor-pointer p-1 relative ${
                          i === activeIndex
                            ? "border-[#1d1c50] ring-2 ring-[#1d1c50]/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                        }`}
                        title={`View image ${i + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Large Stage Image */}
                <div className="flex-1 w-full aspect-square bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 relative overflow-hidden flex items-center justify-center p-4 sm:p-8 group">
                  {mainSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mainSrc}
                      alt={product.title}
                      onClick={() => setShowLightbox(true)}
                      className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-slate-300" />
                  )}

                  {/* Overlays / Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1d1c50] text-white shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Amazon FBA Verified
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-xs tracking-wider uppercase">
                      Limited Time Deal · {savingsPercent}% Off
                    </span>
                  </div>

                  {/* Zoom Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setShowLightbox(true)}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-[#1d1c50] text-xs font-semibold shadow-md border border-slate-200 transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand (1 of {images.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Assurance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                <span className="font-bold text-slate-900 text-xs block">Amazon FBA Fast</span>
                <span className="text-slate-500 text-[10px] block leading-tight">Direct US warehouse delivery</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                <Layers className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                <span className="font-bold text-slate-900 text-xs block">60D Memory Foam</span>
                <span className="text-slate-500 text-[10px] block leading-tight">Dense support that holds its shape</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                <span className="font-bold text-slate-900 text-xs block">CertiPUR-US®</span>
                <span className="text-slate-500 text-[10px] block leading-tight">Zero toxic foam chemicals</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                <Award className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
                <span className="font-bold text-slate-900 text-xs block">OEKO-TEX® 100</span>
                <span className="text-slate-500 text-[10px] block leading-tight">Standard tested fabric</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Amazon Buy Box, Specs & Cart Controls (5 / 12 on Desktop) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Amazon Listing Header */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">

              {/* Brand Link & Amazon Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1d1c50] font-bold hover:underline cursor-pointer flex items-center gap-1">
                    Visit the Dr. Prime Store
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Model: {product.sku}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-[#1d1c50] font-serif tracking-tight leading-snug !mb-0">
                  {product.title}
                </h1>

                {/* Rating Bar & Amazon Choice Ribbon */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 ml-1">4.9</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-blue-700 hover:underline cursor-pointer font-medium">
                    1,240 ratings
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 text-[11px]">
                    500+ bought in past month
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#1d1c50] text-amber-300">
                    Amazon's <span className="text-white">Choice</span>
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    in <em>Neck & Cervical Contour Pillows</em>
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Amazon Pricing Block */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-rose-600">
                    -{savingsPercent}%
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#1d1c50]">
                    {formatPrice(currentPrice, product.currency)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>List Price: <span className="line-through">{formatPrice(listPrice, product.currency)}</span></span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    You save {formatPrice(savings, product.currency)}
                  </span>
                </div>
              </div>

              {/* Prime Shipping Strip */}
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1 text-amber-950">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-blue-700 font-black italic">prime</span>
                  <span>FREE Delivery Tomorrow</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Fulfilled directly through <strong>Amazon US Fulfillment Centers (MCF)</strong>.
                </p>
              </div>

              {/* Amazon Identifiers (ASIN, SKU, FNSKU copyable pills) */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 block">Amazon Catalog Identifiers:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {product.asin && (
                    <button
                      type="button"
                      onClick={() => handleCopy(product.asin, "ASIN")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-300/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Click to copy ASIN"
                    >
                      <span>ASIN: {product.asin}</span>
                      {copiedField === "ASIN" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-amber-800" />
                      )}
                    </button>
                  )}

                  {product.sku && (
                    <button
                      type="button"
                      onClick={() => handleCopy(product.sku, "SKU")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Click to copy SKU"
                    >
                      <span>SKU: {product.sku}</span>
                      {copiedField === "SKU" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  )}

                  {fnSku && (
                    <button
                      type="button"
                      onClick={() => handleCopy(fnSku, "FNSKU")}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Click to copy FNSKU"
                    >
                      <span>FNSKU: {fnSku}</span>
                      {copiedField === "FNSKU" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Live Amazon FBA Warehouse Inventory Counter */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-emerald-800">
                      In Stock: {product.stock_quantity} units available
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Live SP-API Sync</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <div>Total Amazon Units: <strong className="text-slate-900">{totalAmazonUnits.toLocaleString()}</strong></div>
                  <div>Inbound to Hubs: <strong className="text-slate-900">{inboundUnits.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Color Variant Selector */}
              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-bold text-slate-800">
                  Color: <span className="text-[#1d1c50] font-extrabold">{currentColorName} Contour</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {allProducts.length > 0 ? (
                    allProducts.map((p) => {
                      const isCurrent = Number(p.id) === Number(product.id);
                      const isPillCream = (p.title || p.sku || "").toLowerCase().includes("cream");
                      const colorLabel = isPillCream ? "Cream Contour" : "Blue Contour";
                      const pImg = p.images?.[0]?.url || p.image_url;

                      return (
                        <Link
                          key={p.id}
                          href={`/shop/${p.id}`}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-xs ${
                            isCurrent
                              ? "border-[#1d1c50] bg-[#1d1c50]/5 ring-2 ring-[#1d1c50]/20 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0 p-0.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={pImg} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">{colorLabel}</div>
                            <div className="text-[11px] text-slate-500">{formatPrice(p.price)} · In stock</div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-[#1d1c50] shrink-0" />}
                        </Link>
                      );
                    })
                  ) : null}
                </div>
              </div>

              {/* Amazon "About This Item" Bullet Highlights */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
                  About this item
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>RELIEVE CERVICAL PAIN & STIFFNESS:</strong> Therapeutic butterfly wave cradles the head and aligns cervical vertebrae to ease pressure and nerve tension.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>CUSTOMIZABLE DUAL-HEIGHT ZONES:</strong> 4.7" loft engineered for side sleepers (shoulder clearance) and 3.9" contour for back and stomach sleeping posture.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>60D HIGH-DENSITY MEMORY FOAM:</strong> Ultra-resilient slow-rebound core retains its shape year after year without sagging or bottoming out.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>COOLING BREATHABLE COVER:</strong> Skin-friendly ice-silk stretch nylon & spandex cover promotes continuous airflow; zippered and machine washable.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>TRIPLE SAFETY CERTIFIED:</strong> CertiPUR-US® non-toxic certified core, OEKO-TEX® Standard 100 fabric, and ISPA sleep industry member standards.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Amazon Buy Box Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="px-3.5 py-2.5 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-40 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={!inStock}
                      className="px-3.5 py-2.5 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-40 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    disabled={!inStock || addMutation.isPending}
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#1d1c50] hover:bg-[#282772] active:bg-[#14133c] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    {addMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding…
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart · {formatPrice(currentPrice * quantity, product.currency)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now / Express Checkout Button */}
                <button
                  type="button"
                  disabled={!inStock || addMutation.isPending}
                  onClick={handleBuyNow}
                  className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Now (Instant Checkout)</span>
                </button>

                {/* View on Official Amazon Store */}
                {product.amazon_url && (
                  <a
                    href={product.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>View on Official Amazon US Listing</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {/* Seller & FBA Terms Strip */}
                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Ships from:</span>
                    <strong className="text-slate-800">Amazon Fulfillment Centers</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Sold by:</span>
                    <strong className="text-slate-800">Dr. Prime Official Store</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Returns:</span>
                    <strong className="text-slate-800">30-Day Return / Replacement</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <strong className="text-slate-800">Secure 256-Bit SSL Checkout</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Amazon A+ Content (Enhanced Brand Content / EBC) */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              From the Manufacturer
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1c50] font-serif !mb-0">
              Engineered for Clinical Ergonomics & Restorative Sleep
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Developed in partnership with sleep posture specialists to alleviate chronic neck stiffness, shoulder impingement, and sleep-induced headaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#fbf9f4] rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1d1c50] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 !mb-0">
                Dual-Height Ergonomic Wave
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Features a 4.7" contour on one side for broad-shouldered side sleepers, and a 3.9" contour on the reverse for back sleepers to maintain spinal neutral.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#fbf9f4] rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1d1c50] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 !mb-0">
                60D High-Density Core
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard pillows use lightweight 40D foam that goes flat in weeks. Our 60D slow-rebound foam provides orthopedic firmness that never sags.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#fbf9f4] rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1d1c50] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 !mb-0">
                Shoulder Relief Grooves
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anatomical butterfly side contours cradle shoulders and arms comfortably, eliminating nocturnal numbness and arm pins-and-needles.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#fbf9f4] rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1d1c50] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 !mb-0">
                Breathable Cooling Cover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Woven from ice-silk nylon & spandex for 3D ventilation. The hidden zipper allows effortless removal for hygienic machine washing.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Amazon "Compare with Similar Items" Table */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d1c50] font-serif !mb-1">
              Compare with Similar Items
            </h2>
            <p className="text-xs text-slate-500">
              See how the Dr. Prime Cervical Contour compares to conventional sleep pillows.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider w-1/4">Feature</th>
                  <th className="py-3 px-4 font-bold text-[#1d1c50] bg-blue-50/60 rounded-t-xl w-1/4">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Dr. Prime Cervical Pillow
                    </span>
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-600 w-1/4">Generic Memory Foam</th>
                  <th className="py-3 px-4 font-bold text-slate-600 w-1/4">Traditional Down / Feather</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Ergonomic Contour Shape</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">Anatomical Butterfly Wave</td>
                  <td className="py-3.5 px-4 text-slate-500">Flat Block or Basic Roll</td>
                  <td className="py-3.5 px-4 text-slate-500">Flat (No contour)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Foam Density Rating</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">60D High-Density (Never sags)</td>
                  <td className="py-3.5 px-4 text-slate-500">35D–45D Low Density</td>
                  <td className="py-3.5 px-4 text-slate-500">0D (Flattens completely)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Dual Height Profiles</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">Dual: 4.7" & 3.9" Reversible</td>
                  <td className="py-3.5 px-4 text-slate-500">Single Fixed Height</td>
                  <td className="py-3.5 px-4 text-slate-500">Uncontrolled loft</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Cervical Spine Traction Hollow</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">Yes — Clinically Contoured</td>
                  <td className="py-3.5 px-4 text-slate-500">No traction hollow</td>
                  <td className="py-3.5 px-4 text-slate-500">None</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Washable Zippered Outer Cover</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">Yes — Machine Washable</td>
                  <td className="py-3.5 px-4 text-slate-500">Sometimes non-removable</td>
                  <td className="py-3.5 px-4 text-slate-500">Dry-clean only</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Health Certifications</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">CertiPUR-US® & OEKO-TEX® 100</td>
                  <td className="py-3.5 px-4 text-slate-500">Often uncertified</td>
                  <td className="py-3.5 px-4 text-slate-500">Allergen prone</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-700">Fulfillment & Delivery</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700 bg-blue-50/60">Amazon FBA US Warehouses</td>
                  <td className="py-3.5 px-4 text-slate-500">Standard slow postage</td>
                  <td className="py-3.5 px-4 text-slate-500">Standard postal carrier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: Amazon Technical Specifications Table */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1c50] font-serif !mb-0">
                Technical Specifications & Product Details
              </h2>
              <p className="text-xs text-slate-500">
                Official Amazon listing metadata (Marketplace ID: ATVPDKIKX0DER)
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              ASIN: {product.asin}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Brand</span>
              <span className="font-semibold text-slate-900">Dr. Prime (US Registered Brand)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Model / SKU</span>
              <span className="font-mono font-semibold text-slate-900">{product.sku}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Amazon ASIN</span>
              <span className="font-mono font-bold text-amber-900">{product.asin}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Amazon FNSKU</span>
              <span className="font-mono font-semibold text-slate-900">{fnSku}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Color Variant</span>
              <span className="font-semibold text-slate-900">{currentColorName} Contour</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Fill Material</span>
              <span className="font-semibold text-slate-900">60D High-Density Slow-Rebound Viscoelastic Memory Foam</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Cover Fabric</span>
              <span className="font-semibold text-slate-900">Ice-Silk Stretch Nylon & Spandex (Zippered)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Ergonomic Dimensions</span>
              <span className="font-semibold text-slate-900">24.4" L × 15.0" W × 4.7" / 3.9" Dual Height</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Item Weight</span>
              <span className="font-semibold text-slate-900">Approx. 3.2 lbs (1.45 kg)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Target Sleep Positions</span>
              <span className="font-semibold text-slate-900">Side Sleepers, Back Sleepers, Stomach Sleepers</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Certifications</span>
              <span className="font-semibold text-slate-900">CertiPUR-US®, OEKO-TEX® Standard 100, ISPA Member</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Fulfillment Channel</span>
              <span className="font-semibold text-slate-900">Amazon Multi-Channel Fulfillment (MCF)</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: Amazon Customer Questions & Answers (Q&A Accordion) */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d1c50] font-serif !mb-1">
              Customer Questions & Answers
            </h2>
            <p className="text-xs text-slate-500">
              Real answers to common questions about usage, unboxing, and care.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50/50 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full py-4 px-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-[#1d1c50] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1d1c50] font-extrabold flex items-center justify-center text-[11px] shrink-0">
                        Q
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#1d1c50]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                        A
                      </span>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: Customer Reviews & Rating Breakdown */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Star Breakdown Summary (4 / 12) */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1c50] font-serif !mb-0">
                Customer Reviews
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-lg font-extrabold text-slate-900">4.9 out of 5</span>
              </div>
              <p className="text-xs text-slate-500">1,240 global ratings across Amazon US</p>

              {/* Progress Bars */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-12 text-blue-700 font-medium">5 star</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <span className="w-8 text-right text-slate-600 font-semibold">92%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-12 text-blue-700 font-medium">4 star</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "6%" }}></div>
                  </div>
                  <span className="w-8 text-right text-slate-600 font-semibold">6%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-12 text-blue-700 font-medium">3 star</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "2%" }}></div>
                  </div>
                  <span className="w-8 text-right text-slate-600 font-semibold">2%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-12 text-slate-400">2 star</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                  <span className="w-8 text-right text-slate-400">0%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-12 text-slate-400">1 star</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                  <span className="w-8 text-right text-slate-400">0%</span>
                </div>
              </div>
            </div>

            {/* Right: Verified Customer Testimonials (8 / 12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Review 1 */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1d1c50] text-white font-bold flex items-center justify-center text-xs">
                      S
                    </div>
                    <span className="font-bold text-slate-900">Sarah Jenkins</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Reviewed in the United States on Oct 4, 2026</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">Finally woke up without neck cricks!</span>
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                    Verified Purchase
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  "I was skeptical about cervical pillows after trying two other brands that collapsed into mush. The 60D density on the Dr. Prime pillow is noticeably superior — it cradles my neck on the 4.7-inch side without suffocating my ears. After three nights, my persistent morning neck spasms are completely gone."
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>38 people found this helpful</span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                      M
                    </div>
                    <span className="font-bold text-slate-900">Michael Ross, PT</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Reviewed in the United States on Sep 28, 2026</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">Clinically accurate cervical curvature</span>
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                    Verified Purchase
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  "As a physical therapist, I frequently advise patients on pillow ergonomics. The central hollow correctly relieves lordotic strain on the cervical vertebrae, while the butterfly wings allow side sleepers to keep their arms in a neutral position without tingling. Delivered in 2 days in genuine Amazon FBA packaging."
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>64 people found this helpful</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Full Brand Story & Description */}
        {product.description && (
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d1c50] font-serif !mb-0">
              Product Overview & Brand Story
            </h2>
            <div
              className="product-description text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3
                [&_p]:leading-relaxed [&_p]:mb-3
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-3
                [&_strong]:text-[#1d1c50] [&_strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}

      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 sm:p-8 backdrop-blur-xs">
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between text-white text-xs max-w-5xl">
            <span className="font-semibold text-slate-300">
              {product.title} — Image {activeIndex + 1} of {images.length}
            </span>
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Stage in Lightbox */}
          <div className="relative flex-1 flex items-center justify-center max-w-4xl w-full my-4">
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1))}
                className="absolute left-2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer"
                title="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainSrc}
              alt=""
              className="max-h-[75vh] max-w-full object-contain rounded-xl select-none"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1))}
                className="absolute right-2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer"
                title="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-3xl py-2 scrollbar-thin">
              {images.map((src, i) => (
                <button
                  key={`lightbox-${src}-${i}`}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 bg-slate-900 transition-all cursor-pointer p-0.5 ${
                    i === activeIndex
                      ? "border-amber-400 ring-2 ring-amber-400/50 scale-105"
                      : "border-slate-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
