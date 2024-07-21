importScripts(
    'https://cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js'
);

self.addEventListener('fetch', function(event) {});

self.addEventListener('activate', () => self.clients.claim());