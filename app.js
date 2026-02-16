/* ============================================
   HashPDF — Client-side Document Integrity
   Zero dependencies. Web Crypto API only.
   ============================================ */

(function () {
  'use strict';

  // ─── Microparticle Animation System ──────────────────
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let width, height;

    const CONFIG = {
      count: 45,
      color: [108, 99, 255],   // accent purple
      maxRadius: 3,
      minRadius: 1,
      maxSpeed: 0.3,
      connectDistance: 120,
      connectOpacity: 0.06,
      particleOpacity: 0.15,
      pulseSpeed: 0.008,
    };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
        vy: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
        radius: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
        baseRadius: 0,
        pulseOffset: Math.random() * Math.PI * 2,
        opacity: 0.05 + Math.random() * CONFIG.particleOpacity,
      };
    }

    function init() {
      resize();
      particles = [];
      // Fewer particles on mobile
      const count = width < 640 ? Math.floor(CONFIG.count * 0.5) : CONFIG.count;
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.baseRadius = p.radius;
        particles.push(p);
      }
    }

    function update() {
      const time = Date.now() * CONFIG.pulseSpeed;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with padding
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Gentle pulse
        p.radius = p.baseRadius + Math.sin(time + p.pulseOffset) * 0.5;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const r = CONFIG.color[0];
      const g = CONFIG.color[1];
      const b = CONFIG.color[2];

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.connectDistance) {
            const opacity = (1 - dist / CONFIG.connectDistance) * CONFIG.connectOpacity;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + p.opacity + ')';
        ctx.fill();
      }
    }

    function animate() {
      update();
      draw();
      animationId = requestAnimationFrame(animate);
    }

    // Start
    init();
    animate();

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        init();
      }, 200);
    });

    // Pause when tab not visible (performance)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  })();

  // ─── Constants ───────────────────────────────────────
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks for progress reporting
  const SITE_URL = window.location.origin + window.location.pathname;

  // ─── DOM References ──────────────────────────────────

  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');

  // Seal panel
  const sealDropzone = document.getElementById('seal-dropzone');
  const sealFileInput = document.getElementById('seal-file-input');
  const sealFileInfo = document.getElementById('seal-file-info');
  const sealFileName = document.getElementById('seal-file-name');
  const sealFileSize = document.getElementById('seal-file-size');
  const sealFileRemove = document.getElementById('seal-file-remove');
  const sealProgress = document.getElementById('seal-progress');
  const sealProgressFill = document.getElementById('seal-progress-fill');
  const sealProgressText = document.getElementById('seal-progress-text');
  const sealHashResult = document.getElementById('seal-hash-result');
  const sealHashValue = document.getElementById('seal-hash-value');
  const sealHashCopy = document.getElementById('seal-hash-copy');
  const sealShareSection = document.getElementById('seal-share-section');
  const sealNativeShare = document.getElementById('seal-native-share');
  const sealFallbackShare = document.getElementById('seal-fallback-share');
  const sealShareNativeBtn = document.getElementById('seal-share-native-btn');
  const sealShareWhatsapp = document.getElementById('seal-share-whatsapp');
  const sealShareTelegram = document.getElementById('seal-share-telegram');
  const sealShareEmail = document.getElementById('seal-share-email');
  const sealShareCopyLink = document.getElementById('seal-share-copy-link');
  const sealShareNote = document.getElementById('seal-share-note');

  // Verify panel
  const verifyExpectedHash = document.getElementById('verify-expected-hash');
  const verifyHashSource = document.getElementById('verify-hash-source');
  const verifyDropzone = document.getElementById('verify-dropzone');
  const verifyFileInput = document.getElementById('verify-file-input');
  const verifyFileInfo = document.getElementById('verify-file-info');
  const verifyFileName = document.getElementById('verify-file-name');
  const verifyFileSize = document.getElementById('verify-file-size');
  const verifyFileRemove = document.getElementById('verify-file-remove');
  const verifyProgress = document.getElementById('verify-progress');
  const verifyProgressFill = document.getElementById('verify-progress-fill');
  const verifyProgressText = document.getElementById('verify-progress-text');
  const verifyResult = document.getElementById('verify-result');

  // ─── State ───────────────────────────────────────────
  let sealCurrentFile = null;
  let sealCurrentHash = null;
  let verifyCurrentFile = null;

  // ─── Utility Functions ───────────────────────────────

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function bufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    const hex = [];
    for (let i = 0; i < bytes.length; i++) {
      hex.push(bytes[i].toString(16).padStart(2, '0'));
    }
    return hex.join('');
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  function canNativeShare() {
    return navigator.share && navigator.canShare && isMobileDevice();
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch {
        document.body.removeChild(ta);
        return false;
      }
    }
  }

  // ─── Hashing ─────────────────────────────────────────

  /**
   * Compute SHA-256 hash of a File object.
   * Uses chunked reading for progress reporting on large files.
   */
  async function computeHash(file, onProgress) {
    // For small files, just hash directly
    if (file.size <= CHUNK_SIZE) {
      if (onProgress) onProgress(50);
      const buffer = await file.arrayBuffer();
      if (onProgress) onProgress(80);
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      if (onProgress) onProgress(100);
      return bufferToHex(hashBuffer);
    }

    // For large files, read in chunks for progress
    // We still need to hash the whole file at once (Web Crypto doesn't support streaming digest natively)
    // So we read chunks for progress, concatenate, then hash
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const chunks = [];
    let loaded = 0;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const slice = file.slice(start, end);
      const buffer = await slice.arrayBuffer();
      chunks.push(new Uint8Array(buffer));
      loaded += buffer.byteLength;
      if (onProgress) {
        onProgress(Math.round((loaded / file.size) * 80)); // 0-80% for reading
      }
    }

    // Concatenate all chunks
    const fullBuffer = new Uint8Array(file.size);
    let offset = 0;
    for (const chunk of chunks) {
      fullBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    if (onProgress) onProgress(90);
    const hashBuffer = await crypto.subtle.digest('SHA-256', fullBuffer.buffer);
    if (onProgress) onProgress(100);
    return bufferToHex(hashBuffer);
  }

  // ─── URL Fragment Handling ───────────────────────────

  function generateVerifyLink(hash, filename) {
    const params = new URLSearchParams();
    params.set('hash', hash);
    if (filename) {
      params.set('name', filename);
    }
    return SITE_URL + '#verify&' + params.toString();
  }

  function parseUrlFragment() {
    const fragment = window.location.hash;
    if (!fragment || !fragment.startsWith('#verify')) return null;

    // Parse #verify&hash=abc&name=file.pdf
    const paramStr = fragment.replace('#verify&', '').replace('#verify', '');
    if (!paramStr) return null;

    const params = new URLSearchParams(paramStr);
    return {
      hash: params.get('hash') || null,
      name: params.get('name') || null,
    };
  }

  // ─── Share Message Generation ────────────────────────

  function generateShareMessage(hash, filename, verifyLink) {
    const name = filename || 'document';
    return (
      `🔒 I'm sending you "${name}" — please verify it hasn't been tampered with:\n\n` +
      `${verifyLink}\n\n` +
      `Open the link above, drop in the file you received, and you'll instantly see if it matches.`
    );
  }

  // ─── Tab Switching ───────────────────────────────────

  function switchTab(tabName) {
    tabButtons.forEach(function (btn) {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'panel-' + tabName);
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(btn.dataset.tab);
    });
  });

  // ─── Drag & Drop Setup ──────────────────────────────

  function setupDropzone(dropzone, fileInput, onFile) {
    // Prevent defaults
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (event) {
      dropzone.addEventListener(event, function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Visual feedback
    ['dragenter', 'dragover'].forEach(function (event) {
      dropzone.addEventListener(event, function () {
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(function (event) {
      dropzone.addEventListener(event, function () {
        dropzone.classList.remove('dragover');
      });
    });

    // File drop
    dropzone.addEventListener('drop', function (e) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFile(files[0]);
      }
    });

    // File input
    fileInput.addEventListener('change', function () {
      if (fileInput.files.length > 0) {
        onFile(fileInput.files[0]);
      }
    });
  }

  // ─── SEAL FLOW ──────────────────────────────────────

  function resetSeal() {
    sealCurrentFile = null;
    sealCurrentHash = null;
    sealFileInfo.classList.remove('visible');
    sealProgress.classList.remove('visible');
    sealHashResult.classList.remove('visible');
    sealShareSection.classList.remove('visible');
    sealProgressFill.style.width = '0%';
    sealFileInput.value = '';
  }

  async function handleSealFile(file) {
    resetSeal();
    sealCurrentFile = file;

    // Show file info
    sealFileName.textContent = file.name;
    sealFileSize.textContent = formatFileSize(file.size);
    sealFileInfo.classList.add('visible');

    // Show progress
    sealProgress.classList.add('visible');

    try {
      const hash = await computeHash(file, function (percent) {
        sealProgressFill.style.width = percent + '%';
        if (percent < 80) {
          sealProgressText.textContent = 'Reading file... ' + percent + '%';
        } else if (percent < 100) {
          sealProgressText.textContent = 'Computing SHA-256 hash...';
        } else {
          sealProgressText.textContent = 'Done!';
        }
      });

      sealCurrentHash = hash;

      // Hide progress, show hash
      setTimeout(function () {
        sealProgress.classList.remove('visible');
        sealHashValue.textContent = hash;
        sealHashResult.classList.add('visible');

        // Setup share buttons
        setupShareButtons(hash, file);
        sealShareSection.classList.add('visible');
      }, 300);
    } catch (err) {
      sealProgressText.textContent = 'Error: ' + err.message;
      sealProgressFill.style.width = '0%';
    }
  }

  function setupShareButtons(hash, file) {
    const verifyLink = generateVerifyLink(hash, file.name);
    const message = generateShareMessage(hash, file.name, verifyLink);

    // Detect native share support
    if (canNativeShare()) {
      sealNativeShare.style.display = 'flex';
      sealFallbackShare.style.display = 'none';
      sealShareNote.style.display = 'none';

      sealShareNativeBtn.onclick = async function () {
        try {
          const shareData = {
            title: 'Verify: ' + file.name,
            text: message,
            files: [file],
          };

          // Check if can share with files
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
          } else {
            // Fallback to text-only native share
            await navigator.share({
              title: 'Verify: ' + file.name,
              text: message,
            });
          }
        } catch (err) {
          // User cancelled or error — show fallback
          if (err.name !== 'AbortError') {
            sealNativeShare.style.display = 'none';
            sealFallbackShare.style.display = 'flex';
            sealShareNote.style.display = 'block';
          }
        }
      };
    } else {
      sealNativeShare.style.display = 'none';
      sealFallbackShare.style.display = 'flex';
      sealShareNote.style.display = 'block';
    }

    // WhatsApp
    const waText = encodeURIComponent(message);
    sealShareWhatsapp.href = 'https://wa.me/?text=' + waText;

    // Telegram
    const tgText = encodeURIComponent(message);
    sealShareTelegram.href = 'https://t.me/share/url?text=' + tgText;

    // Email
    const emailSubject = encodeURIComponent('Verify document: ' + file.name);
    const emailBody = encodeURIComponent(message);
    sealShareEmail.href = 'mailto:?subject=' + emailSubject + '&body=' + emailBody;

    // Copy link
    sealShareCopyLink.onclick = async function () {
      const success = await copyToClipboard(message);
      if (success) {
        sealShareCopyLink.innerHTML = '<span class="share-btn__icon">✅</span> Copied!';
        setTimeout(function () {
          sealShareCopyLink.innerHTML = '<span class="share-btn__icon">🔗</span> Copy Link';
        }, 2000);
      }
    };
  }

  // Copy hash button
  sealHashCopy.addEventListener('click', async function () {
    if (!sealCurrentHash) return;
    const success = await copyToClipboard(sealCurrentHash);
    if (success) {
      sealHashCopy.textContent = 'Copied!';
      sealHashCopy.classList.add('copied');
      setTimeout(function () {
        sealHashCopy.textContent = 'Copy';
        sealHashCopy.classList.remove('copied');
      }, 2000);
    }
  });

  // Remove file
  sealFileRemove.addEventListener('click', resetSeal);

  // Setup dropzone
  setupDropzone(sealDropzone, sealFileInput, handleSealFile);

  // ─── VERIFY FLOW ─────────────────────────────────────

  function resetVerify() {
    verifyCurrentFile = null;
    verifyFileInfo.classList.remove('visible');
    verifyProgress.classList.remove('visible');
    verifyResult.classList.remove('visible');
    verifyProgressFill.style.width = '0%';
    verifyFileInput.value = '';
    verifyResult.innerHTML = '';
    verifyResult.className = 'verify-result';
  }

  async function handleVerifyFile(file) {
    // Reset previous result but keep hash
    verifyCurrentFile = file;
    verifyFileInfo.classList.remove('visible');
    verifyProgress.classList.remove('visible');
    verifyResult.classList.remove('visible');
    verifyResult.className = 'verify-result';
    verifyProgressFill.style.width = '0%';
    verifyFileInput.value = '';

    const expectedHash = verifyExpectedHash.value.trim().toLowerCase();

    if (!expectedHash) {
      verifyResult.className = 'verify-result verify-result--mismatch visible';
      verifyResult.innerHTML =
        '<span class="verify-result__icon">⚠️</span>' +
        '<div class="verify-result__title">No expected hash provided</div>' +
        '<p class="verify-result__desc">Please paste the SHA-256 hash from the sender in the field above, then drop the file again.</p>';
      return;
    }

    // Show file info
    verifyFileName.textContent = file.name;
    verifyFileSize.textContent = formatFileSize(file.size);
    verifyFileInfo.classList.add('visible');

    // Show progress
    verifyProgress.classList.add('visible');

    try {
      const computedHash = await computeHash(file, function (percent) {
        verifyProgressFill.style.width = percent + '%';
        if (percent < 80) {
          verifyProgressText.textContent = 'Reading file... ' + percent + '%';
        } else if (percent < 100) {
          verifyProgressText.textContent = 'Computing SHA-256 hash...';
        } else {
          verifyProgressText.textContent = 'Comparing...';
        }
      });

      setTimeout(function () {
        verifyProgress.classList.remove('visible');

        const isMatch = computedHash === expectedHash;

        if (isMatch) {
          verifyResult.className = 'verify-result verify-result--match visible';
          verifyResult.innerHTML =
            '<span class="verify-result__icon">✅</span>' +
            '<div class="verify-result__title">Integrity Verified</div>' +
            '<p class="verify-result__desc">This file is identical to the original. It has not been tampered with or modified in any way.</p>' +
            '<div class="verify-result__hashes">' +
            '  <div class="verify-result__hash-row">' +
            '    <span class="verify-result__hash-label">SHA-256:</span>' +
            '    <span class="verify-result__hash-value">' + computedHash + '</span>' +
            '  </div>' +
            '</div>';
        } else {
          verifyResult.className = 'verify-result verify-result--mismatch visible';
          verifyResult.innerHTML =
            '<span class="verify-result__icon">❌</span>' +
            '<div class="verify-result__title">Integrity Check Failed</div>' +
            '<p class="verify-result__desc">This file does NOT match the original. It may have been modified, corrupted, or you may have the wrong file.</p>' +
            '<div class="verify-result__hashes">' +
            '  <div class="verify-result__hash-row">' +
            '    <span class="verify-result__hash-label">Expected:</span>' +
            '    <span class="verify-result__hash-value">' + expectedHash + '</span>' +
            '  </div>' +
            '  <div class="verify-result__hash-row">' +
            '    <span class="verify-result__hash-label">Got:</span>' +
            '    <span class="verify-result__hash-value">' + computedHash + '</span>' +
            '  </div>' +
            '</div>';
        }
      }, 300);
    } catch (err) {
      verifyProgressText.textContent = 'Error: ' + err.message;
      verifyProgressFill.style.width = '0%';
    }
  }

  // Remove file
  verifyFileRemove.addEventListener('click', resetVerify);

  // Setup dropzone
  setupDropzone(verifyDropzone, verifyFileInput, handleVerifyFile);

  // ─── URL Fragment Initialization ─────────────────────

  function initFromUrl() {
    const params = parseUrlFragment();
    if (params && params.hash) {
      // Switch to verify tab
      switchTab('verify');

      // Fill in the hash
      verifyExpectedHash.value = params.hash;
      verifyExpectedHash.classList.add('prefilled');
      verifyHashSource.classList.add('visible');

      if (params.name) {
        verifyHashSource.textContent = '✅ Hash loaded for: ' + params.name;
      }
    }
  }

  // Listen for hash changes (in case user navigates back/forward)
  window.addEventListener('hashchange', initFromUrl);

  // Initialize on load
  initFromUrl();

})();
