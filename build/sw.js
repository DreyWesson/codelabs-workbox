importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([
  {
    "url": "style/main.css",
    "revision": "5cc6b8b0154003ba255926700342a1b0"
  },
  {
    "url": "index.html",
    "revision": "62edf17b9472750f9d761f1904173dc0"
  },
  {
    "url": "js/animation.js",
    "revision": "732b3d64bda4cf4594650a7dbbfca326"
  },
  {
    "url": "images/home/business.jpg",
    "revision": "9c3ec8d2a8a188bab9ddc212a64a0c1e"
  },
  {
    "url": "images/icon/icon.svg",
    "revision": "0d077eac3b5028d3543f7e35908d6ecb"
  },
  {
    "url": "pages/offline.html",
    "revision": "abd55f2ef953e10af7874378c96f730b"
  },
  {
    "url": "pages/404.html",
    "revision": "c21a9e328fda21f62b4c875b649ec30c"
  }
]);

  workbox.routing.registerRoute(
    /(.*)articles(.*)\.(?:png|gif|jpg)/,
    workbox.strategies.cacheFirst({
      cacheName: "images-cache",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /(.*)images\/icon\/(.*)\.(?:svg)/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "icon-cache",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 5,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  const articleHandler = workbox.strategies.networkFirst({
    cacheName: "articles-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      }),
    ],
  });

  workbox.routing.registerRoute(/(.*)article(.*)\.html/, (args) => {
    return articleHandler.handle(args).then((response) => {
      if (!response) {
        return caches.match("pages/offline.html");
      } else if (response.status === 404) {
        return caches.match("pages/404.html");
      }
      return response;
    });
  });

  const postHandler = workbox.strategies.networkFirst({
    cacheName: "posts-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      }),
    ],
  });

  workbox.routing.registerRoute(/(.*)pages(.*)\.html/, (args) => {
    return postHandler.handle(args).then((response) => {
      if (!response) {
        return caches.match("pages/offline.html");
      } else if (response.status === 404) {
        return caches.match("pages/404.html");
      }
      return response;
    });
  });
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
