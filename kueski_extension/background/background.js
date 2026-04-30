// src/background/background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "CHECK_STORE") {
		const domain = message.payload.domain;

		// Llamamos a tu API modularizada
		fetch(`http://localhost:3000/commerce/check?domain=${domain}`)
			.then((res) => res.json())
			.then((result) => {
				// Le pasamos la data de la API (is_partner, etc) de vuelta al Content Script
				sendResponse(result.data);
			})
			.catch((err) => {
				console.error("Error conectando con la API:", err);
				sendResponse({ is_partner: false });
			});

		return true; // Mantiene el canal abierto para la respuesta asíncrona
	}
});
