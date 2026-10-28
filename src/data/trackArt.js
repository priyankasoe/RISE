// Drawings for the technical challenge tracks on the Workshops page, rendered
// in characters by morphField. Each paints white on black, centred in its
// panel inside the same box (BOX of the shorter side), so all three have the
// same margins and sit at the same visual size.
const BOX = 0.84;

const start = (pen, w, h) => {
  pen.fillStyle = '#000';
  pen.fillRect(0, 0, w, h);
  pen.fillStyle = '#fff';
  pen.strokeStyle = '#fff';
  pen.lineCap = 'round';
  pen.lineJoin = 'round';
  const s = Math.min(w, h) * BOX;
  // origin at the top-left of a centred s x s box
  return { s, x0: (w - s) / 2, y0: (h - s) / 2 };
};

const gear = (pen, cx, cy, r, teeth, angle) => {
  pen.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = angle + (i * Math.PI) / teeth;
    const rr = i % 2 ? r : r * 1.18;
    pen.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  pen.closePath();
  pen.fill();
  pen.fillStyle = '#000';
  pen.beginPath(); pen.arc(cx, cy, r * 0.35, 0, Math.PI * 2); pen.fill();
  pen.fillStyle = '#fff';
};

export const TRACK_ART = [
  // Hardware: three meshing gears, clustered in the box
  (pen, w, h, now) => {
    const { s, x0, y0 } = start(pen, w, h);
    const t = now / 3000;
    gear(pen, x0 + s * 0.36, y0 + s * 0.56, s * 0.27, 10, t);
    gear(pen, x0 + s * 0.75, y0 + s * 0.3, s * 0.17, 8, -t * 1.6 + 0.2);
    gear(pen, x0 + s * 0.78, y0 + s * 0.8, s * 0.13, 7, t * 2.1);
  },
  // Electrical: two circuit traces with a pulse running along each, and a chip
  (pen, w, h, now) => {
    const { s, x0, y0 } = start(pen, w, h);
    const traces = [
      [[0, 0.3], [0.3, 0.3], [0.4, 0.5], [0.7, 0.5], [0.8, 0.25], [1, 0.25]],
      [[0, 0.75], [0.2, 0.75], [0.3, 0.6], [0.55, 0.6], [0.65, 0.85], [1, 0.85]],
    ];
    const at = ([x, y]) => [x0 + x * s, y0 + y * s];
    pen.lineWidth = s * 0.035;
    traces.forEach((tr, k) => {
      pen.globalAlpha = 0.55;
      pen.beginPath();
      tr.forEach((pt, i) => (i ? pen.lineTo(...at(pt)) : pen.moveTo(...at(pt))));
      pen.stroke();
      pen.globalAlpha = 1;
      tr.slice(1, -1).forEach((pt) => { pen.beginPath(); pen.arc(...at(pt), s * 0.035, 0, Math.PI * 2); pen.fill(); });
      const p = ((now / 2600 + k * 0.5) % 1) * (tr.length - 1);
      const i = Math.floor(p);
      const f = p - i;
      const [ax, ay] = tr[i];
      const [bx, by] = tr[i + 1];
      pen.beginPath(); pen.arc(...at([ax + (bx - ax) * f, ay + (by - ay) * f]), s * 0.055, 0, Math.PI * 2); pen.fill();
    });
    pen.fillRect(x0 + s * 0.4, y0 + s * 0.04, s * 0.22, s * 0.16);
  },
  // Software: an indented block of code lines and a blinking cursor
  (pen, w, h, now) => {
    const { s, x0, y0 } = start(pen, w, h);
    const lines = [[0, 0.62], [0.1, 0.8], [0.2, 0.5], [0.2, 0.7], [0.1, 0.4], [0, 0.3], [0.1, 0.56]];
    const lh = s / lines.length;
    lines.forEach(([indent, len], i) => {
      pen.globalAlpha = i % 3 === 0 ? 1 : 0.6;
      pen.fillRect(x0 + s * indent, y0 + lh * (i + 0.25), s * len * (1 - indent), lh * 0.5);
    });
    pen.globalAlpha = 1;
    if (Math.floor(now / 530) % 2) pen.fillRect(x0 + s * 0.62, y0 + lh * 6.15, s * 0.05, lh * 0.7);
  },
];
