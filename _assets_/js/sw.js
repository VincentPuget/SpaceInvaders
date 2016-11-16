"use strict";

// self.importScripts("js/config.js");

const CONST = {
  "SW": {
    "DATA_CACHE_NAME": "checkMySport-data-v1",
    "CACHE_NAME": "heckMySport-1",
    "URLS_TO_CACHE": [

      "/manifest.json",
      "/browserconfig.xml",

      "/css/allVendor.min.css",
      "/css/all.min.css",

      "/js/allVendor.min.js",
      "/js/all.min.js"
    ]
  }
};


self.oninstall = (event) => {
  console.log("[ServiceWorker] Install"); // eslint-disable-line no-console
  // Perform install steps
  event.waitUntil(
    caches.open(CONST.SW.CACHE_NAME)
    .then(
      (cache) => {
        console.log("[ServiceWorker] Caching app shell"); // eslint-disable-line no-console
        return cache.addAll(CONST.SW.URLS_TO_CACHE);
      }
    )
  );
};

self.onactivate = (event) => {
  console.log("[ServiceWorker] Activate"); // eslint-disable-line no-console
  event.waitUntil(
    caches.keys()
    .then(
      (keyList) => {
        return Promise.all(keyList.map(
            (key) => {
              if (key !== CONST.SW.CACHE_NAME && key !== CONST.SW.DATA_CACHE_NAME) {
                console.log("[ServiceWorker] Removing old cache", key); // eslint-disable-line no-console
                return caches.delete(key);
              }
            }
          )
        );
      }
    )
  );
};

self.onfetch = (event) => {
  console.log("[Service Worker] Fetch", event.request.url); // eslint-disable-line no-console

  if (event.request.url.indexOf(CONST.API.BASE_URL) > -1) {
    event.respondWith(
      caches.open(CONST.SW.DATA_CACHE_NAME)
      .then(
        (cache) => {
          return fetch(event.request)
          .then(
            (response) => {
              cache.put(event.request.url, response.clone());
              return response;
            }
          );
        }
      )
    );
  }
  else {
    event.respondWith(
      caches.match(event.request)
      .then(
        (response) => {
          return response || fetch(event.request);
        }
      )
    );
  }
};
