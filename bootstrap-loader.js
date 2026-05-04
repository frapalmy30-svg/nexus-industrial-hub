/**
 * NEXUS Bootstrap Loader
 * Paste this in DevTools Console at https://dist-fmwkbjau.devinapps.com/
 * This loads all 8 NEXUS 3D models with neon colors into the simulator.
 */
(function() {
  console.log('%cNEXUS Bootstrap: loading models...', 'color:#00FFFF;font-size:13px;font-weight:bold');
  const s = document.createElement('script');
  s.src = 'https://nexus-digital-twin.loca.lt/simulator-integration-code-complete.js';
  s.setAttribute('data-nexus', 'true');
  s.onload = function() {
    console.log('%cNEXUS models ready! Initializing...', 'color:#00FF00;font-size:12px');
    setTimeout(function() {
      if (typeof initializeNexusModels === 'function') {
        initializeNexusModels();
      } else {
        console.error('initializeNexusModels not found - check console errors above');
      }
    }, 800);
  };
  s.onerror = function() {
    console.error('Failed to load from tunnel. Try the direct fetch approach below.');
    console.log('%cAlternative: fetch then eval', 'color:#FF8800');
    fetch('https://nexus-digital-twin.loca.lt/simulator-integration-code-complete.js',
      { headers: { 'bypass-tunnel-reminder': 'true' } })
      .then(r => r.text())
      .then(code => { eval(code); setTimeout(() => initializeNexusModels(), 800); })
      .catch(e => console.error('Fetch also failed:', e));
  };
  document.body.appendChild(s);
})();
