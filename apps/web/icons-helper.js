'use strict';

(function initIconHelper(global){
  if (!global) return;

  const NS = 'http://www.w3.org/2000/svg';

  const paths = {
    moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    sun: 'M12 4V2M12 22v-2M4.93 4.93 3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2m20 0h-2M4.93 19.07 3.51 20.49M20.49 3.51l-1.42 1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
    menu: 'M3 6h18M3 12h18M3 18h18',
    dot: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  };

  function createSvg(pathKey, size = 16) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','2');
    svg.setAttribute('stroke-linecap','round');
    svg.setAttribute('stroke-linejoin','round');

    const d = paths[pathKey] || paths.dot;
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', d);
    svg.appendChild(el);
    return svg;
  }

  function Icon(name, size){
    const svg = createSvg(name, size || 16);
    const wrapper = document.createElement('span');
    wrapper.className = 'tbx-icon';
    wrapper.appendChild(svg);
    return wrapper;
  }

  function injectIcons(root){
    const scope = root || document;
    scope.querySelectorAll('[data-icon-name]')
      .forEach(node => {
        const name = node.getAttribute('data-icon-name');
        const size = Number(node.getAttribute('data-icon-size')||'16');
        const icon = Icon(name || 'dot', size);
        node.replaceChildren(icon);
      });
  }

  global.Icon = Icon; // returns a DOM node
  global.injectIcons = injectIcons;
})(typeof window !== 'undefined' ? window : this);

