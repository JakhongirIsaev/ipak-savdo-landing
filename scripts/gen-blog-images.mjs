// Programmatic on-brand editorial cover generator for BirLiy blog.
// Produces clean vector covers (no text, no photos, no logos, no player likeness)
// as JPG at the three aspect ratios the blog uses.
// Run from the repo root: node scripts/gen-blog-images.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "photos", "blog");
mkdirSync(OUT, { recursive: true });

const INK = "#0b1826";
const GREEN = "#03b73d";
const TEAL = "#10a076";
const PAPER = "#f4f7f4";

// deterministic pseudo-random from a seed
function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function backdrop(w, h, accent) {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#eaf1ec"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.82" cy="0.12" r="0.7">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.07"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.08" cy="0.95" r="0.7">
      <stop offset="0" stop-color="${TEAL}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${TEAL}"/>
    </linearGradient>
    <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c7a3a"/>
      <stop offset="1" stop-color="#075f2c"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glowA)"/>
  <rect width="${w}" height="${h}" fill="url(#glowB)"/>
  <rect x="0" y="0" width="${w}" height="6" fill="url(#brand)"/>`;
}

// faint dot grid in a region
function dots(w, h, accent, rand) {
  let g = "";
  const step = Math.round(Math.min(w, h) / 12);
  for (let y = step; y < h; y += step) {
    for (let x = step; x < w; x += step) {
      if (rand() > 0.82) {
        const r = 1.6 + rand() * 1.4;
        g += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${accent}" opacity="0.10"/>`;
      }
    }
  }
  return g;
}

// small brand chip with an abstract check mark (no text)
function brandChip(w, h) {
  const s = Math.round(Math.min(w, h) * 0.085);
  const x = Math.round(w * 0.06);
  const y = Math.round(h * 0.06);
  const r = Math.round(s * 0.28);
  return `<g>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" fill="url(#brand)"/>
    <path d="M ${x + s * 0.28} ${y + s * 0.52} L ${x + s * 0.45} ${y + s * 0.68} L ${x + s * 0.74} ${y + s * 0.34}"
      fill="none" stroke="#ffffff" stroke-width="${(s * 0.1).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

function shadowEllipse(cx, cy, rx) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.16}" fill="${INK}" opacity="0.10"/>`;
}

// ---- PRODUCT MOTIFS ----
function phoneFrame(cx, cy, u) {
  const pw = u * 0.62, ph = u * 1.18;
  const x = cx - pw / 2, y = cy - ph / 2;
  const rx = pw * 0.16;
  return { pw, ph, x, y, rx,
    frame: `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="${rx}" fill="#ffffff" stroke="#d4ded7" stroke-width="${u*0.012}"/>
    <rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="${rx}" fill="none" stroke="${GREEN}" stroke-width="${u*0.012}" opacity="0.18"/>` };
}

function motifPhoneSale(cx, cy, u, accent) {
  const p = phoneFrame(cx, cy, u);
  const ix = p.x + p.pw * 0.16, iw = p.pw * 0.68;
  let top = p.y + p.ph * 0.12;
  // header bar
  let s = p.frame;
  s += `<rect x="${ix}" y="${top}" width="${iw*0.55}" height="${u*0.06}" rx="${u*0.03}" fill="${INK}" opacity="0.85"/>`;
  top += u * 0.16;
  // receipt rows
  for (let i = 0; i < 3; i++) {
    s += `<rect x="${ix}" y="${top}" width="${iw}" height="${u*0.07}" rx="${u*0.02}" fill="#eef3ef"/>`;
    s += `<rect x="${ix}" y="${top}" width="${iw*(0.5+i*0.12)}" height="${u*0.07}" rx="${u*0.02}" fill="${accent}" opacity="0.18"/>`;
    top += u * 0.12;
  }
  // QR square
  const qx = ix, qy = top + u*0.02, qs = iw * 0.46;
  s += `<rect x="${qx}" y="${qy}" width="${qs}" height="${qs}" rx="${u*0.02}" fill="#ffffff" stroke="${INK}" stroke-width="${u*0.012}"/>`;
  const cell = qs / 5;
  const r2 = rng(7);
  for (let a=0;a<5;a++) for(let b=0;b<5;b++){ if(r2()>0.5) s+=`<rect x="${(qx+a*cell).toFixed(1)}" y="${(qy+b*cell).toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" fill="${INK}"/>`; }
  // green check badge
  const bx = p.x + p.pw*0.78, by = qy + qs*0.5, br = u*0.16;
  s += `<circle cx="${bx}" cy="${by}" r="${br}" fill="url(#brand)"/>`;
  s += `<path d="M ${bx-br*0.42} ${by} L ${bx-br*0.08} ${by+br*0.34} L ${bx+br*0.46} ${by-br*0.36}" fill="none" stroke="#fff" stroke-width="${br*0.22}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return shadowEllipse(cx, cy + p.ph*0.58, p.pw*0.62) + s;
}

function motifDebt(cx, cy, u, accent) {
  const p = phoneFrame(cx, cy, u);
  const ix = p.x + p.pw * 0.15, iw = p.pw * 0.70;
  let top = p.y + p.ph * 0.13;
  let s = p.frame;
  s += `<rect x="${ix}" y="${top}" width="${iw*0.6}" height="${u*0.06}" rx="${u*0.03}" fill="${INK}" opacity="0.85"/>`;
  top += u*0.17;
  // debt rows: name bar + coin
  for (let i=0;i<4;i++){
    s += `<rect x="${ix}" y="${top}" width="${iw}" height="${u*0.11}" rx="${u*0.025}" fill="#f3f7f4"/>`;
    s += `<rect x="${ix+u*0.04}" y="${top+u*0.03}" width="${iw*0.42}" height="${u*0.045}" rx="${u*0.02}" fill="${INK}" opacity="0.45"/>`;
    s += `<circle cx="${ix+iw-u*0.07}" cy="${top+u*0.055}" r="${u*0.035}" fill="${accent}" opacity="0.9"/>`;
    top += u*0.135;
  }
  return shadowEllipse(cx, cy + p.ph*0.58, p.pw*0.62) + s;
}

function motifBoxes(cx, cy, u, accent) {
  // stacked inventory boxes + a magnifier
  let s = shadowEllipse(cx, cy + u*0.72, u*0.78);
  const bw = u*0.42;
  const positions = [
    [cx - bw*1.05, cy + u*0.18], [cx, cy + u*0.18], [cx + bw*1.05, cy + u*0.18],
    [cx - bw*0.52, cy - u*0.30], [cx + bw*0.52, cy - u*0.30],
  ];
  positions.forEach(([x,y],i)=>{
    s += `<rect x="${x-bw/2}" y="${y-bw/2}" width="${bw}" height="${bw}" rx="${u*0.04}" fill="#ffffff" stroke="#d4ded7" stroke-width="${u*0.014}"/>`;
    s += `<rect x="${x-bw/2}" y="${y-bw/2}" width="${bw}" height="${bw*0.3}" rx="${u*0.04}" fill="${accent}" opacity="${0.16+0.05*i}"/>`;
    s += `<rect x="${x-bw*0.12}" y="${y-bw/2}" width="${bw*0.24}" height="${bw*0.3}" fill="${accent}" opacity="0.30"/>`;
  });
  // magnifier
  const mx = cx + u*0.66, my = cy - u*0.52, mr = u*0.22;
  s += `<circle cx="${mx}" cy="${my}" r="${mr}" fill="#ffffff" stroke="url(#brand)" stroke-width="${u*0.04}"/>`;
  s += `<line x1="${mx+mr*0.7}" y1="${my+mr*0.7}" x2="${mx+mr*1.5}" y2="${my+mr*1.5}" stroke="${GREEN}" stroke-width="${u*0.05}" stroke-linecap="round"/>`;
  return s;
}

// ---- AI MOTIF ----
function motifAI(cx, cy, u, accent, seed) {
  const rand = rng(seed*13+1);
  let s = shadowEllipse(cx, cy + u*0.7, u*0.8);
  // network nodes around
  const nodes = [];
  const ring = u*0.92;
  for (let i=0;i<6;i++){
    const ang = (Math.PI*2*i)/6 + rand()*0.5;
    const rad = ring*(0.7+rand()*0.4);
    nodes.push([cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad*0.8]);
  }
  // connecting lines
  nodes.forEach((n,i)=>{ s += `<line x1="${cx}" y1="${cy}" x2="${n[0].toFixed(1)}" y2="${n[1].toFixed(1)}" stroke="${accent}" stroke-width="${u*0.012}" opacity="0.30"/>`; });
  nodes.forEach((n,i)=>{
    const r = u*(0.05+rand()*0.05);
    const fill = i%2===0 ? `url(#brand)` : `#ffffff`;
    s += `<circle cx="${n[0].toFixed(1)}" cy="${n[1].toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" stroke="${accent}" stroke-width="${u*0.01}"/>`;
  });
  // central chat/search bubble
  const bw=u*0.96, bh=u*0.66, x=cx-bw/2, y=cy-bh/2;
  s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${u*0.14}" fill="#ffffff" stroke="#d4ded7" stroke-width="${u*0.014}"/>`;
  s += `<path d="M ${cx-u*0.1} ${y+bh} L ${cx-u*0.02} ${y+bh+u*0.16} L ${cx+u*0.14} ${y+bh} Z" fill="#ffffff" stroke="#d4ded7" stroke-width="${u*0.012}"/>`;
  // lines inside
  s += `<rect x="${x+u*0.16}" y="${y+u*0.16}" width="${bw*0.6}" height="${u*0.06}" rx="${u*0.03}" fill="${INK}" opacity="0.75"/>`;
  s += `<rect x="${x+u*0.16}" y="${y+u*0.30}" width="${bw*0.42}" height="${u*0.05}" rx="${u*0.025}" fill="${accent}" opacity="0.5"/>`;
  // magnifier inside bubble
  const mx=x+bw*0.78, my=y+bh*0.6, mr=u*0.12;
  s += `<circle cx="${mx}" cy="${my}" r="${mr}" fill="none" stroke="url(#brand)" stroke-width="${u*0.03}"/>`;
  s += `<line x1="${mx+mr*0.7}" y1="${my+mr*0.7}" x2="${mx+mr*1.4}" y2="${my+mr*1.4}" stroke="${GREEN}" stroke-width="${u*0.035}" stroke-linecap="round"/>`;
  // spark
  const sx=cx+u*0.62, sy=cy-u*0.66, ss=u*0.13;
  s += `<path d="M ${sx} ${sy-ss} L ${sx+ss*0.28} ${sy-ss*0.28} L ${sx+ss} ${sy} L ${sx+ss*0.28} ${sy+ss*0.28} L ${sx} ${sy+ss} L ${sx-ss*0.28} ${sy+ss*0.28} L ${sx-ss} ${sy} L ${sx-ss*0.28} ${sy-ss*0.28} Z" fill="url(#brand)"/>`;
  return s;
}

// ---- FOOTBALL MOTIF ----
function motifFootball(cx, cy, u, accent, seed) {
  const rand = rng(seed*17+3);
  const pw=u*1.7, ph=u*1.18, x=cx-pw/2, y=cy-ph/2;
  let s = shadowEllipse(cx, cy+ph*0.55, pw*0.5);
  s += `<rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="${u*0.08}" fill="url(#pitch)"/>`;
  // stripes
  for(let i=0;i<6;i++){ if(i%2===0) s+=`<rect x="${x+i*(pw/6)}" y="${y}" width="${pw/6}" height="${ph}" fill="#ffffff" opacity="0.04"/>`; }
  const sw=u*0.018;
  s += `<rect x="${x+u*0.06}" y="${y+u*0.06}" width="${pw-u*0.12}" height="${ph-u*0.12}" rx="${u*0.05}" fill="none" stroke="#ffffff" stroke-width="${sw}" opacity="0.85"/>`;
  s += `<line x1="${cx}" y1="${y+u*0.06}" x2="${cx}" y2="${y+ph-u*0.06}" stroke="#ffffff" stroke-width="${sw}" opacity="0.85"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${u*0.26}" fill="none" stroke="#ffffff" stroke-width="${sw}" opacity="0.85"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${u*0.03}" fill="#ffffff" opacity="0.85"/>`;
  // tactic dashed arrow (varies by seed)
  const dir = rand()>0.5?1:-1;
  const ax=cx-dir*u*0.5, ay=cy+dir*u*0.2, bx=cx+dir*u*0.55, by=cy-dir*u*0.28;
  s += `<path d="M ${ax} ${ay} Q ${cx} ${cy-dir*u*0.6} ${bx} ${by}" fill="none" stroke="${GREEN}" stroke-width="${u*0.03}" stroke-dasharray="${u*0.07} ${u*0.05}" stroke-linecap="round"/>`;
  s += `<path d="M ${bx} ${by} l ${-dir*u*0.12} ${-u*0.02} m ${dir*u*0.12} ${u*0.02} l ${-dir*u*0.05} ${u*0.12}" fill="none" stroke="${GREEN}" stroke-width="${u*0.03}" stroke-linecap="round" stroke-linejoin="round"/>`;
  // shop "box" token
  const tx=cx-dir*u*0.5, ty=cy+dir*u*0.2, ts=u*0.2;
  s += `<rect x="${tx-ts/2}" y="${ty-ts/2}" width="${ts}" height="${ts}" rx="${u*0.03}" fill="#ffffff"/>`;
  s += `<rect x="${tx-ts/2}" y="${ty-ts/2}" width="${ts}" height="${ts*0.32}" rx="${u*0.03}" fill="${accent}"/>`;
  // ball
  const blx=cx+dir*u*0.55, bly=cy-dir*u*0.28, blr=u*0.13;
  s += `<circle cx="${blx}" cy="${bly}" r="${blr}" fill="#ffffff" stroke="${INK}" stroke-width="${u*0.01}"/>`;
  s += `<circle cx="${blx}" cy="${bly}" r="${blr*0.32}" fill="${INK}"/>`;
  for(let i=0;i<5;i++){ const a=(Math.PI*2*i)/5; s+=`<circle cx="${(blx+Math.cos(a)*blr*0.62).toFixed(1)}" cy="${(bly+Math.sin(a)*blr*0.62).toFixed(1)}" r="${(blr*0.13).toFixed(1)}" fill="${INK}"/>`; }
  return s;
}

const ACCENTS = [GREEN, TEAL];

const POSTS = [
  { slug: "magazin-uchun-dastur-telefonda-savdo", motif: "phone", seed: 1 },
  { slug: "qarz-daftar-orniga-nima", motif: "debt", seed: 2 },
  { slug: "dokonda-nima-qolganini-telefondan-bilish", motif: "boxes", seed: 3 },
  { slug: "ai-qidiruv-va-agentlar-kichik-biznes", motif: "ai", seed: 4 },
  { slug: "ai-dan-foyda-malumotlar-va-nazorat", motif: "ai", seed: 5 },
  { slug: "futbol-saboq-portugaliya-kongo", motif: "football", seed: 6 },
  { slug: "futbol-saboq-angliya-xorvatiya", motif: "football", seed: 7 },
  { slug: "futbol-saboq-gana-panama", motif: "football", seed: 8 },
  { slug: "futbol-saboq-uzbekiston-kolumbiya", motif: "football", seed: 9 },
];

const RATIOS = [
  { tag: "1x1", w: 1200, h: 1200 },
  { tag: "4x3", w: 1200, h: 900 },
  { tag: "16x9", w: 1200, h: 675 },
];

function buildSvg(post, w, h) {
  const accent = ACCENTS[post.seed % ACCENTS.length];
  const u = Math.min(w, h) * 0.30;
  const cx = w / 2, cy = h / 2;
  const rand = rng(post.seed * 101 + w);
  let motif = "";
  if (post.motif === "phone") motif = motifPhoneSale(cx, cy, u, accent);
  else if (post.motif === "debt") motif = motifDebt(cx, cy, u, accent);
  else if (post.motif === "boxes") motif = motifBoxes(cx, cy, u, accent);
  else if (post.motif === "ai") motif = motifAI(cx, cy, u, accent, post.seed);
  else if (post.motif === "football") motif = motifFootball(cx, cy, u, accent, post.seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${backdrop(w, h, accent)}
  ${dots(w, h, accent, rand)}
  ${motif}
  ${brandChip(w, h)}
</svg>`;
}

let count = 0;
for (const post of POSTS) {
  for (const r of RATIOS) {
    const svg = buildSvg(post, r.w, r.h);
    const file = join(OUT, `${post.slug}-${r.tag}.jpg`);
    await sharp(Buffer.from(svg)).jpeg({ quality: 86, chromaSubsampling: "4:4:4" }).toFile(file);
    count++;
  }
}
console.log(`Generated ${count} cover images into ${OUT}`);
