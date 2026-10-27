self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let titulo = "Jarvis";
  let texto = "Chegou.";
  try {
    const dados = event.data.json();
    titulo = dados.title || dados.body || titulo;
    texto = dados.body || titulo;
  } catch (e) {
    if (event.data) texto = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: texto,
      icon: "icon-192.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
});
