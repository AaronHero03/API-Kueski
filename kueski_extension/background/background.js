const isDev = false;

// Dependiendo de isDev, elegimos la URL base
const API_BASE_URL = isDev
	? "http://localhost:3000"
	: "https://api-kueski.onrender.com";

chrome.runtime.onInstalled.addListener(() => {
	// Esto desbloquea chrome.storage.local para tus content scripts
	chrome.storage.local.setAccessLevel({
		accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
	});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "CHECK_STORE") {
		const domain = message.payload.domain;

		// Llamamos a tu API usando la URL base dinámica
		fetch(`${API_BASE_URL}/commerce/check?domain=${domain}`)
			.then((res) => {
				// Si el servidor responde pero con un error HTTP, lo lanzamos al catch
				if (!res.ok) {
					throw new Error(`Respuesta de red no OK: ${res.status}`);
				}
				return res.json();
			})
			.then((result) => {
				// Le pasamos la data de la API (is_partner, etc) de vuelta al Content Script
				sendResponse(result.data);
			})
			.catch((err) => {
				// Ahora el error te dirá exactamente en qué entorno falló
				console.error(`Error conectando con la API en ${API_BASE_URL}:`, err);
				sendResponse({ is_partner: false });
			});

		return true; // Mantiene el canal abierto para la respuesta asíncrona
	}
});
