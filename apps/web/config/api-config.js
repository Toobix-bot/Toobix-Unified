'use strict';

(function initToobixApiConfig(global) {
  if (!global || typeof global !== 'object') {
    return;
  }

  var DEFAULTS = {
    daemon: 'http://localhost:9999',
    bridge: 'http://localhost:3001',
    moments: 'http://localhost:9994',
    reality: 'http://localhost:9992',
    expression: 'http://localhost:9991',
    momentStream: 'http://localhost:9994',
    memory: 'http://localhost:9995',
    analytics: 'http://localhost:9996',
    tasks: 'http://localhost:9997',
    achievements: 'http://localhost:9998',
    blockworld: 'http://localhost:9993',
    sandbox: 'http://localhost:3003',
    storyIdle: 'http://localhost:3004',
    blockworldAI: 'http://localhost:9990',
    serviceConsciousness: 'http://localhost:9989',
    portManager: 'http://localhost:9988',
    ethics: 'http://localhost:9981',
    luna: 'http://localhost:9987',
    dataStore: 'http://localhost:9986'
  };

  var envOverrides = {};
  if (global.__TOOBIX_API_CONFIG__ && typeof global.__TOOBIX_API_CONFIG__ === 'object') {
    envOverrides = global.__TOOBIX_API_CONFIG__;
  }

  var storedOverrides = {};
  try {
    if (global.localStorage) {
      var raw = global.localStorage.getItem('TOOBIX_API_OVERRIDES');
      if (raw) {
        storedOverrides = JSON.parse(raw);
      }
    }
  } catch (error) {
    console.warn('[Toobix] Konnte TOOBIX_API_OVERRIDES nicht laden:', error);
  }

  var existing = {};
  if (global.TOOBIX_CONFIG && typeof global.TOOBIX_CONFIG.API === 'object') {
    existing = global.TOOBIX_CONFIG.API;
  }

  var merged = Object.assign({}, DEFAULTS, envOverrides, storedOverrides, existing);

  global.TOOBIX_CONFIG = global.TOOBIX_CONFIG || {};
  global.TOOBIX_CONFIG.API = merged;

  if (typeof global.getToobixApiConfig !== 'function') {
    global.getToobixApiConfig = function getToobixApiConfig() {
      return global.TOOBIX_CONFIG.API;
    };
  }
})(typeof window !== 'undefined' ? window : undefined);
