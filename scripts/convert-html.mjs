import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFragment } from "parse5";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HTML_DIR = path.resolve(ROOT, "../01.dairy-farm");
const APP_DIR = path.join(ROOT, "app");

const PAGES = [
  { file: "index.html", out: "page.js", name: "HomePage", title: "Home" },
  { file: "index-image.html", out: "home-image/page.js", name: "HomeImagePage", title: "Home Image" },
  { file: "index-video.html", out: "home-video/page.js", name: "HomeVideoPage", title: "Home Video" },
  { file: "about.html", out: "about/page.js", name: "AboutPage", title: "About Us" },
  { file: "services.html", out: "services/page.js", name: "ServicesPage", title: "Services" },
  { file: "service-single.html", out: "service-single/page.js", name: "ServiceSinglePage", title: "Service Details" },
  { file: "blog.html", out: "blog/page.js", name: "BlogPage", title: "Blog" },
  { file: "blog-single.html", out: "blog-single/page.js", name: "BlogSinglePage", title: "Blog Details" },
  { file: "products.html", out: "products/page.js", name: "ProductsPage", title: "Our Products" },
  { file: "product-single.html", out: "product-single/page.js", name: "ProductSinglePage", title: "Product Details" },
  { file: "team.html", out: "team/page.js", name: "TeamPage", title: "Our Team" },
  { file: "team-single.html", out: "team-single/page.js", name: "TeamSinglePage", title: "Team Details" },
  { file: "testimonials.html", out: "testimonials/page.js", name: "TestimonialsPage", title: "Testimonials" },
  { file: "image-gallery.html", out: "image-gallery/page.js", name: "ImageGalleryPage", title: "Image Gallery" },
  { file: "video-gallery.html", out: "video-gallery/page.js", name: "VideoGalleryPage", title: "Video Gallery" },
  { file: "faqs.html", out: "faqs/page.js", name: "FaqsPage", title: "FAQs" },
  { file: "contact.html", out: "contact/page.js", name: "ContactPage", title: "Contact Us" },
  { file: "404.html", out: "not-found.js", name: "NotFoundPage", title: "Page Not Found" },
  { file: "404.html", out: "404/page.js", name: "Error404Page", title: "404" },
];

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const BOOL_ATTRS = new Set([
  "allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls",
  "default", "defer", "disabled", "formnovalidate", "hidden", "ismap", "loop",
  "multiple", "muted", "nomodule", "novalidate", "open", "playsinline",
  "readonly", "required", "reversed", "selected",
]);

const ATTR_MAP = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  maxlength: "maxLength",
  minlength: "minLength",
  readonly: "readOnly",
  maxlength: "maxLength",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  crossorigin: "crossOrigin",
  datetime: "dateTime",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  maxlength: "maxLength",
  minlength: "minLength",
  novalidate: "noValidate",
  radiogroup: "radioGroup",
  spellcheck: "spellCheck",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  allowfullscreen: "allowFullScreen",
  referrerpolicy: "referrerPolicy",
  playsinline: "playsInline",
  charset: "charSet",
};

const LINK_MAP = {
  "./": "/",
  "index.html": "/",
  "index-image.html": "/home-image",
  "index-video.html": "/home-video",
  "about.html": "/about",
  "services.html": "/services",
  "service-single.html": "/service-single",
  "blog.html": "/blog",
  "blog-single.html": "/blog-single",
  "products.html": "/products",
  "product-single.html": "/product-single",
  "team.html": "/team",
  "team-single.html": "/team-single",
  "testimonials.html": "/testimonials",
  "image-gallery.html": "/image-gallery",
  "video-gallery.html": "/video-gallery",
  "faqs.html": "/faqs",
  "contact.html": "/contact",
  "404.html": "/404",
  "form-process.php": "/api/contact",
};

function rewriteHref(value) {
  if (LINK_MAP[value]) return LINK_MAP[value];
  return value;
}

function rewriteSrc(value) {
  if (value.startsWith("images/")) return `/${value}`;
  if (value.startsWith("js/")) return `/${value}`;
  if (value.startsWith("css/")) return `/${value}`;
  return value;
}

function cssToJsxStyle(style) {
  const parts = style
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .map((rule) => {
      const idx = rule.indexOf(":");
      if (idx === -1) return null;
      const prop = rule.slice(0, idx).trim();
      const val = rule.slice(idx + 1).trim();
      const key = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (/^-?\d+(\.\d+)?$/.test(val)) return `${key}: ${val}`;
      return `${key}: ${JSON.stringify(val)}`;
    })
    .filter(Boolean);
  return `{{ ${parts.join(", ")} }}`;
}

function escapeJsxText(text) {
  return text.replace(/[{}]/g, (ch) => (ch === "{" ? "{'{'}" : "{'}'}"));
}

function quoteAttr(value) {
  if (value.includes("{") || value.includes("}")) {
    return `{${JSON.stringify(value)}}`;
  }
  if (value.includes('"') && !value.includes("'")) {
    return `'${value}'`;
  }
  return `"${value.replace(/"/g, "&quot;")}"`;
}

function serializeAttrs(attrs = []) {
  if (!attrs.length) return "";
  return attrs
    .map((attr) => {
      let name = attr.name;
      let value = attr.value;
      const lower = name.toLowerCase();

      if (lower === "style") {
        return ` style=${cssToJsxStyle(value)}`;
      }

      if (lower.startsWith("on") && lower.length > 2) {
        return "";
      }

      const mapped = ATTR_MAP[lower] || name;
      if (lower === "href") value = rewriteHref(value);
      if (lower === "src" || lower === "poster") value = rewriteSrc(value);
      if (lower === "srcset") {
        value = value
          .split(",")
          .map((part) => {
            const [url, size] = part.trim().split(/\s+/, 2);
            return `${rewriteSrc(url)}${size ? ` ${size}` : ""}`;
          })
          .join(", ");
      }

      if (BOOL_ATTRS.has(lower)) {
        return ` ${mapped}`;
      }

      return ` ${mapped}=${quoteAttr(value)}`;
    })
    .join("");
}

function serializeNode(node, indent) {
  if (node.nodeName === "#text") {
    return escapeJsxText(node.value);
  }

  if (node.nodeName === "#comment") {
    const data = (node.data || "").replace(/\*\//g, "* /");
    return `{/*${data}*/}`;
  }

  if (node.nodeName === "#document-fragment") {
    return (node.childNodes || [])
      .map((child) => serializeNode(child, indent))
      .join("");
  }

  const tag = node.nodeName;
  if (tag === "#document") {
    return (node.childNodes || [])
      .map((child) => serializeNode(child, indent))
      .join("");
  }

  const attrs = serializeAttrs(node.attrs);
  const children = node.childNodes || [];

  if (VOID_TAGS.has(tag)) {
    return `<${tag}${attrs} />`;
  }

  const inner = children.map((child) => serializeNode(child, indent + 1)).join("");
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

function extractMainHtml(html) {
  const headerEnd = html.indexOf("<!-- Header End -->");
  const footerStart = html.indexOf("<!-- Footer Start -->");
  if (headerEnd === -1 || footerStart === -1) {
    throw new Error("Could not find header/footer markers");
  }
  return html.slice(headerEnd + "<!-- Header End -->".length, footerStart).trim();
}

function wrapPage(name, title, jsx) {
  return `export const metadata = {
  title: ${JSON.stringify(title)},
};

export default function ${name}() {
  return (
    <>
${jsx}
    </>
  );
}
`;
}

function convertFile(page) {
  const htmlPath = path.join(HTML_DIR, page.file);
  const html = fs.readFileSync(htmlPath, "utf8");
  const main = extractMainHtml(html);
  const fragment = parseFragment(main);
  const jsx = serializeNode(fragment, 0)
    .replace(/^\s+|\s+$/g, "")
    .split("\n")
    .map((line) => (line.length ? `      ${line}` : line))
    .join("\n");

  const outPath = path.join(APP_DIR, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, wrapPage(page.name, page.title, jsx));
  console.log(`converted ${page.file} -> app/${page.out}`);
}

for (const page of PAGES) {
  convertFile(page);
}
