// src/controllers/users.controller.js

const USERS_DB = {
	user_0001: {
		balance: 12500.5,
		cashback_accumulated: 450.25,
		currency: "MXN",
	},
};

export const getUserDashboard = (req, res) => {
	// Simulamos que el ID viene de un token o sesión
	const usuario = USERS_DB["user_0001"];

	if (!usuario) {
		return res
			.status(404)
			.json({ status: "error", message: "Usuario no encontrado" });
	}

	res.status(200).json({
		status: "success",
		data: {
			balance: { available: usuario.balance, currency: usuario.currency },
			cashback: { available: usuario.cashback_accumulated },
		},
	});
};
