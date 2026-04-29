// src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. MIDDLEWARES (Filtros)
// ==========================================
app.use(cors());
app.use(express.json()); // Transforma el body de las peticiones POST a JSON automáticamente

// ==========================================
// 2. BASES DE DATOS SIMULADAS (Mock Core)
// ==========================================
const USERS_DB = {
	user_0001: {
		balance: 12500.5,
		cashback_accumulated: 450.25,
		currency: "MXN",
	},
};

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
};

const LOANS_DB = [
	{ loan_id: "ln_001", merchant: "MacStore", amount: 2000, status: "active" },
];

// ==========================================
// 3. ENDPOINTS (Rutas de la API)
// ==========================================

// --- Módulo de Autenticación ---

// POST: /auth/login (Sustituye a /auth/link)
app.post("/auth/login", (req, res) => {
	// En un entorno real, aquí validaríamos req.body.email y req.body.password
	res.status(200).json({
		status: "success",
		data: {
			token: "kueski_jwt_fake_0102",
			user: { id: "user_0001", name: "Usuario Prueba" },
		},
	});
});

// GET: /auth/verify (Nuevo)
app.get("/auth/verify", (req, res) => {
	res.status(200).json({ status: "success", is_valid: true });
});

// --- Módulo de Centro de Control ---

// GET: /users/me/dashboard (Sustituye a /user/profiles y /user/{id-user})
app.get("/users/me/dashboard", (req, res) => {
	const usuario = USERS_DB["user_0001"]; // Simulamos que leímos el ID desde el Token JWT

	if (usuario) {
		res.status(200).json({
			status: "success",
			data: {
				balance: { available: usuario.balance, currency: usuario.currency },
				cashback: { available: usuario.cashback_accumulated },
			},
		});
	} else {
		res.status(404).json({ status: "error", message: "Perfil no encontrado" });
	}
});

// --- Módulo de Gestión Inteligente ---

// GET: /commerce/benefits (Sustituye a /stores/check)
app.get("/commerce/benefits", (req, res) => {
	// Express extrae los parámetros de la URL automáticamente en req.query
	const domain = req.query.domain;

	if (!domain) {
		return res.status(400).json({
			status: "error",
			message: "El parámetro domain es obligatorio.",
		});
	}

	const store = STORES_DB[domain.toLowerCase()];

	if (store && store.affiliated) {
		res.status(200).json({
			status: "success",
			data: { is_partner: true, cashback_percentage: store.cashback },
		});
	} else {
		res.status(200).json({
			status: "success",
			data: { is_partner: false },
		});
	}
});

// POST: /transactions/simulate (Sustituye a /cashback/activate y /payment)
app.post("/transactions/simulate", (req, res) => {
	const { cart_total } = req.body;
	const usuario = USERS_DB["user_0001"];

	if (!cart_total) {
		return res
			.status(400)
			.json({ status: "error", message: "Falta el total del carrito" });
	}

	// Lógica inteligente: ¿Alcanza el saldo?
	if (cart_total <= usuario.balance) {
		res.status(200).json({
			status: "success",
			data: {
				is_approved: true,
				payment_plans: [{ installments: 4, amount: cart_total / 4 }],
				cashback_to_earn: cart_total * 0.05, // Suponiendo 5% generico
			},
		});
	} else {
		res.status(200).json({
			status: "success",
			data: {
				is_approved: false,
				rejection_details: {
					user_message: `Tu saldo de $${usuario.balance} no cubre esta compra.`,
				},
			},
		});
	}
});

// GET: /users/me/loans (Nuevo)
app.get("/users/me/loans", (req, res) => {
	res.status(200).json({
		status: "success",
		data: { active_loans: LOANS_DB },
	});
});

// ==========================================
// 4. MANEJO DE RUTAS NO ENCONTRADAS (404)
// ==========================================
app.use((req, res) => {
	// app.use al final atrapa cualquier ruta que no haya hecho match arriba
	res.status(404).send("Aaaaaaaaaaaahhahahhahahahhahahha no jala.");
});

// ==========================================
// 5. INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
	console.log(`🚀 Kueski BFF Gateway corriendo en http://localhost:${PORT}`);
});
