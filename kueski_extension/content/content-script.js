// 1. Obtenemos el dominio limpio (ej: amazon.com.mx)
const currentDomain = window.location.hostname.replace("www.", "");

// 2. Le mandamos un mensaje al "cerebro" (Background Script)
chrome.runtime.sendMessage(
	{ type: "CHECK_STORE", payload: { domain: currentDomain } },
	(response) => {
		// 3. Si la API responde que es socio, mostramos el popup
		if (response && response.is_partner) {
			// Pasamos el cashback y el nombre del dominio
			showKueskiPopup(response.cashback_percentage, currentDomain);
		}
	},
);
