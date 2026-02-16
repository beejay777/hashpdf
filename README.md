# 🛡️ HashPDF

**Verify document integrity with a single link.** Seal your files with a SHA-256 fingerprint, share them however you like, and let anyone verify nothing was tampered with — all from the browser.

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

---

## Why?

PDFs are used for contracts, invoices, and confidential documents — but there's no easy way for a normal person to check if a file was modified after it was sent. HashPDF makes cryptographic integrity verification as simple as drag-and-drop.

## How It Works

1. **Seal** — Drop your file on the site. A unique SHA-256 fingerprint is computed instantly.
2. **Share** — Send the file + a verification link via WhatsApp, email, Telegram, or anything else.
3. **Verify** — The receiver opens the link, drops in the file, and sees ✅ or ❌ immediately.

> **No files are uploaded or stored.** All hashing runs client-side in the browser using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). Not even the site host can see your documents.

## Features

- 🔒 **SHA-256 hashing** via the Web Crypto API — no external libraries
- 📱 **Native sharing on mobile** — share file + verification link together via the Web Share API
- 💻 **Desktop share buttons** — WhatsApp, Telegram, Email, Copy Link (with a reminder to attach the file)
- 🔗 **Verification links** — hash stored in URL fragment (`#`), never sent to the server
- 📊 **Progress bar** for large files with chunked reading
- ✨ **Microparticle background** and micro-animations
- 📄 **Any file type** — PDFs, images, DOCX, ZIP, whatever
- 🌐 **Zero dependencies** — 3 files, works offline once loaded
- ♿ **Accessible** — semantic HTML, ARIA roles, keyboard navigable

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/hashpdf.git
cd hashpdf

# Serve locally (any static server works)
python3 -m http.server 8080
# or
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) and you're ready to go.

## Deployment

HashPDF is a static site — no build step, no server required. Host it anywhere:

| Platform | How |
|----------|-----|
| **GitHub Pages** | Push to `main`, enable Pages in repo settings |
| **Netlify** | Drag and drop the folder, or connect the repo |
| **Vercel** | `npx vercel --prod` |
| **Any web server** | Just serve the files |

## Project Structure

```
hashpdf/
├── index.html      # Single-page app (Seal + Verify tabs)
├── style.css       # Light theme, micro-animations, responsive
├── app.js          # Hashing engine, sharing, particles, URL parsing
├── favicon.svg     # Shield + checkmark icon
└── README.md
```

## Security & Privacy

- **Client-side only** — files never leave the browser
- **No cookies, no analytics, no tracking**
- **URL fragments** (`#hash=...`) are never sent to the server per the HTTP spec
- **SHA-256** is a NIST-approved, collision-resistant hash function
- **Zero dependencies** — the entire codebase is auditable in minutes

> [!NOTE]
> HashPDF verifies **integrity** (the file hasn't changed), not **authenticity** (who sent it). For authenticity, you would need digital signatures, which require key management infrastructure.

## Browser Support

Works in all modern browsers that support the [Web Crypto API](https://caniuse.com/cryptography):

- Chrome 37+
- Firefox 34+
- Safari 11+
- Edge 79+

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built for anyone who needs to verify document integrity.<br>
  <strong>No uploads. No storage. Just math.</strong>
</p>
