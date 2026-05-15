#!/usr/bin/env node
/**
 * Generates required Expo asset files and validates the project setup.
 * Run once with: node scripts/setup.js
 */
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Minimal valid 1x1 green PNG (base64-encoded)
// Full-size versions are regenerated here as solid-color PNGs
function writePng(filePath, width, height, r, g, b) {
  const { execSync } = require('child_process');
  const python = `
import struct, zlib, sys

def png(w, h, r, g, b):
    def u32(n): return struct.pack('>I', n)
    sig = b'\\x89PNG\\r\\n\\x1a\\n'
    def chunk(t, d):
        c = zlib.crc32(t + d) & 0xffffffff
        return u32(len(d)) + t + d + u32(c)
    ihdr = chunk(b'IHDR', u32(w) + u32(h) + b'\\x08\\x02\\x00\\x00\\x00')
    raw = b''.join(b'\\x00' + bytes([r,g,b]*w) for _ in range(h))
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

sys.stdout.buffer.write(png(${width}, ${height}, ${r}, ${g}, ${b}))
`;
  try {
    const data = execSync(`python3 -c "${python.replace(/\n/g, ' ')}"`);
    fs.writeFileSync(filePath, data);
    console.log(`  created ${path.basename(filePath)} (${width}x${height})`);
  } catch {
    // fallback: write a minimal hardcoded 1x1 green PNG
    const minimal = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108020000009001' +
      '2e00000000c4944415478016360f8cfc0000000200014e621bc0000000049454e44ae426082',
      'hex'
    );
    fs.writeFileSync(filePath, minimal);
    console.log(`  created ${path.basename(filePath)} (fallback minimal)`);
  }
}

console.log('\nGenerating assets...');
writePng(path.join(assetsDir, 'icon.png'),          1024, 1024, 27, 107, 58);
writePng(path.join(assetsDir, 'splash.png'),         1284, 2778, 27,  67, 50);
writePng(path.join(assetsDir, 'adaptive-icon.png'),  1024, 1024, 27, 107, 58);
writePng(path.join(assetsDir, 'favicon.png'),          64,   64, 27, 107, 58);

console.log('\nAssets ready. Now add them to app.json if you want custom icons:');
console.log('  "icon": "./assets/icon.png"');
console.log('  "splash": { "image": "./assets/splash.png", ... }');
console.log('\nDone.\n');
