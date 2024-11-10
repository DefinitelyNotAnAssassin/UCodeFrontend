const CACHE_NAME = 'ucode-offline-v1';
const BASE_URL = 'http://127.0.0.1:8000';



const apiEndpoints = [
  `${BASE_URL}/API/courses`,
  `${BASE_URL}/API/userCourses`,
  `${BASE_URL}/API/topics/`,
  `${BASE_URL}/API/subtopics/`,
  // Add other API endpoints here
];


self.addEventListener('fetch', (event) => {
  if (apiEndpoints.some(endpoint => event.request.url.startsWith(endpoint))) {
    // Handle API requests
    alert("API request")
    event.respondWith(
   
      fetchWithAuth(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        })
        .catch((error) => {
          console.error('Failed to fetch API:', error);
          return caches.match(event.request);
        })
    );
  } else {
    // Handle static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
        .catch((error) => {
          console.error('Failed to fetch asset:', error);
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function fetchWithAuth(request) {
  return new Promise((resolve, reject) => {
    const localStorage = window.localStorage;
    const token = JSON.parse(localStorage.getItem("token")); // Adjust based on where you store the token
    const headers = new Headers(request.headers);

    if (token) {
      headers.append('Authorization', `Bearer ${token.access}`);
    }

    const authRequest = new Request(request.url, {
      ...request,
      headers: headers
    });

    fetch(authRequest)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}