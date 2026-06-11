// QA: fetch the rendered landing pages and validate SEO head (JSON-LD + keywords).
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const targets = [
  ["uz", `${base}/`],
  ["ru", `${base}/ru`],
];

for (const [loc, url] of targets) {
  const html = await (await fetch(url)).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const kw = (html.match(/<meta name="keywords" content="([^"]*)"/) || [])[1] || "";
  console.log(`\n=== ${loc} (${url}) ===`);
  console.log("ld+json blocks:", blocks.length);
  for (const b of blocks) {
    try {
      const j = JSON.parse(b);
      const g = j["@graph"] || [j];
      console.log("  graph types:", g.map((n) => n["@type"]).join(", "));
      const sw = g.find((n) => n["@type"] === "SoftwareApplication");
      const faqp = g.find((n) => n["@type"] === "FAQPage");
      if (sw)
        console.log(
          "  SoftwareApplication: ERP in desc:",
          /ERP/i.test(sw.description),
          "| POS in keywords:",
          /POS/i.test(sw.keywords),
          "| offer:",
          sw.offers?.price,
          sw.offers?.priceCurrency,
        );
      if (faqp)
        console.log("  FAQPage questions:", faqp.mainEntity.length, "| first:", JSON.stringify(faqp.mainEntity[0]?.name?.slice(0, 44)));
    } catch (e) {
      console.log("  JSON PARSE FAIL:", e.message, "| raw head:", b.slice(0, 80));
    }
  }
  console.log("  meta keywords: ERP:", /ERP/i.test(kw), "| POS:", /POS/i.test(kw), "| count:", kw.split(",").length);
}
