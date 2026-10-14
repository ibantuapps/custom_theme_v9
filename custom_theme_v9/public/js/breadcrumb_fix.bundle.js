/* ============================================================
   ERPX Custom Theme - Global Breadcrumb Interceptor
   File: public/js/breadcrumb_fix.js
   ============================================================ */

(function () {
  // Config Route
  const TARGET_ROUTE = 'pbx-accounting'; // Route workspace tujuan
  const MATCH_PATHS = ['/app/accounting', '/app/accounting/', 'accounting'];
  const MATCH_TEXTS = ['accounting'];

  // Cegah pendaftaran listener ganda
  if (window.__pbx_bc_installed) return;
  window.__pbx_bc_installed = true;

  console.log('[Breadcrumb Fix] Handler aktif secara global.');

  document.addEventListener('click', function (e) {
    // 1. Cari elemen <a> terdekat yang diklik
    const anchor = e.target.closest ? e.target.closest('a') : null;
    if (!anchor) return;

    // 2. Cek apakah link berada di dalam container Breadcrumb
    const isBreadcrumb = anchor.closest(
      '#navbar-breadcrumbs, .breadcrumb, .navbar-breadcrumbs, .desk-breadcrumbs'
    );
    if (!isBreadcrumb) return;

    // 3. Normalisasi URL dan teks
    const rawHref = (anchor.getAttribute('href') || '').trim();
    const cleanHref = rawHref.replace(window.location.origin, '').toLowerCase();
    const cleanText = (anchor.textContent || '').trim().toLowerCase();

    // 4. Pencocokan path atau teks
    const isPathMatch = MATCH_PATHS.some(
      (path) => cleanHref === path || cleanHref.endsWith(path)
    );
    const isTextMatch = MATCH_TEXTS.includes(cleanText);

    if (isPathMatch || isTextMatch) {
      // Hentikan penanganan router bawaan Frappe sepenuhnya
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Alihkan route hanya jika tidak sedang di halaman tujuan
      if (typeof frappe !== 'undefined' && frappe.get_route_str() !== TARGET_ROUTE) {
        console.log(`[Breadcrumb Fix] Dialihkan: "${cleanText}" -> ${TARGET_ROUTE}`);
        frappe.set_route(TARGET_ROUTE);
      }
    }
  }, true); // Capture phase (true) wajib agar memotong event sebelum handler Frappe
})();
