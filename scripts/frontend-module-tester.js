// Frontend Module Tester for Toobix Dashboard
// Paste this file's content into the Dashboard console (or copy the run function) and run `await runToobixModuleTests()`

(function(){
  async function withTimeout(promise, ms, onTimeout) {
    let id;
    const timeout = new Promise((_, reject) => {
      id = setTimeout(() => reject(new Error('Timeout after ' + ms + 'ms')), ms);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(id);
      if (onTimeout) onTimeout();
    }
  }

  async function runToobixModuleTests(options = {}) {
    const timeoutPerModule = options.timeoutPerModule || 6000;
    const modules = (window.TOOBIX_MODULES && Object.keys(window.TOOBIX_MODULES)) || [];
    const results = [];

    // Hidden container to mount modules
    let root = document.getElementById('toobix-module-tester-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toobix-module-tester-root';
      root.style.position = 'fixed';
      root.style.right = '0';
      root.style.bottom = '0';
      root.style.width = '420px';
      root.style.maxHeight = '70vh';
      root.style.overflow = 'auto';
      root.style.zIndex = 999999;
      root.style.background = 'rgba(0,0,0,0.6)';
      root.style.color = 'white';
      root.style.fontSize = '12px';
      root.style.padding = '8px';
      root.style.borderRadius = '8px 0 0 8px';
      document.body.appendChild(root);
    }

    root.innerHTML = `<div style="font-weight:700;margin-bottom:6px;">Toobix Module Tester</div>`;

    for (const id of modules) {
      const meta = window.TOOBIX_MODULES[id] || {};
      const entry = { id, name: meta.name || id, category: meta.category || 'unknown', dependencies: meta.dependencies || [], status: 'unknown', error: null, timeMs: 0 };
      const moduleContainer = document.createElement('div');
      moduleContainer.style.background = 'rgba(255,255,255,0.03)';
      moduleContainer.style.marginBottom = '6px';
      moduleContainer.style.padding = '6px';
      moduleContainer.style.borderRadius = '6px';
      moduleContainer.innerHTML = `<div style="font-weight:600;">${id} — ${entry.name}</div><div style="color:#ccc; font-size:11px;">Checking...</div>`;
      root.appendChild(moduleContainer);

      const checkStart = performance.now();

      try {
        const loader = meta.loader;
        if (typeof loader !== 'function') {
          entry.status = 'no-loader';
          moduleContainer.lastChild.textContent = 'No loader function';
          results.push(entry);
          continue;
        }

        // Call loader and wait for completion/async
        const maybePromise = (function(){
          try {
            return loader(moduleContainer);
          } catch (err) {
            // synchronous throw
            return Promise.reject(err);
          }
        })();

        // Accept both sync and promise-based loaders
        await withTimeout(Promise.resolve(maybePromise), timeoutPerModule);

        entry.status = 'ok';
        moduleContainer.lastChild.textContent = 'Loaded ✓';
      } catch (err) {
        entry.status = 'error';
        entry.error = (err && err.stack) ? err.stack : String(err);
        moduleContainer.lastChild.textContent = 'Error: ' + (err && err.message ? err.message : String(err));
        moduleContainer.style.border = '1px solid rgba(255,80,80,0.6)';
      } finally {
        entry.timeMs = Math.round(performance.now() - checkStart);
        results.push(entry);
      }

      // small pause to allow any UI timers to schedule
      await new Promise(r => setTimeout(r, 120));
    }

    // Summary
    const ok = results.filter(r => r.status === 'ok').length;
    const err = results.filter(r => r.status === 'error').length;
    const no = results.filter(r => r.status === 'no-loader').length;

    const summary = document.createElement('div');
    summary.style.marginTop = '8px';
    summary.innerHTML = `<div style="font-weight:700;">Summary: ${ok} OK • ${err} Errors • ${no} No-loader</div>`;
    root.insertBefore(summary, root.children[1]);

    // Save results to localStorage and trigger download
    try {
      const key = 'toobixModuleTestResults';
      localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), results }, null, 2));

      const blob = new Blob([JSON.stringify({ timestamp: Date.now(), results }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toobix-module-test-${Date.now()}.json`;
      a.textContent = 'Download results.json';
      a.style.display = 'inline-block';
      a.style.marginTop = '6px';
      a.style.color = '#9be7ff';
      root.appendChild(a);
    } catch (e) {
      console.warn('Failed to save results', e);
    }

    console.table(results.map(r => ({ id: r.id, name: r.name, status: r.status, timeMs: r.timeMs })));
    return results;
  }

  // expose helper
  window.runToobixModuleTests = runToobixModuleTests;
  // auto-run if desired: uncomment below line
  // runToobixModuleTests();
})();
