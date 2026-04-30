// src/controllers/commerce.controller.js

// Traemos nuestra base de datos simulada (solo para este módulo)
const STORES_DB = {
	"amazon.com.mx": {
		id: "store_001",
		name: "Amazon México",
		cashback: 5,
		affiliated: true,
	},
	"mercadolibre.com.mx": {
		id: "stores_002",
		name: "Mercado Libre",
		affiliated: false,
	},
	"expedia.mx": {
		id: "stores_003",
		name: "Expedia",
		cashback: 1,
		affiliated: true,
	},
};

// Exportamos la función que hace el trabajo
export const checkBenefits = (req, res) => {
	try {
		const domain = req.query.domain;

		if (!domain) {
			return res.status(400).json({
				status: "error",
				message: "El parámetro domain es obligatorio.",
			});
		}

		const store = STORES_DB[domain.toLowerCase()];

		if (store && store.affiliated) {
			return res.status(200).json({
				status: "success",
				data: { is_partner: true, cashback_percentage: store.cashback },
			});
		}

		return res.status(200).json({
			status: "success",
			data: { is_partner: false },
		});
	} catch (error) {
		// Aquí empezamos a meter manejo de errores (Try/Catch)
		console.error("Error en checkBenefits:", error);
		res
			.status(500)
			.json({ status: "error", message: "Error interno del servidor" });
	}
};
