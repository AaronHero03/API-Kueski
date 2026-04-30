document.addEventListener("DOMContentLoaded", () => {
	const loginView = document.getElementById("login");
	const dashboardView = document.getElementById("dashboard");

	// 1. REVISAR ESTADO DE SESIÓN AL ABRIR
	function checkSession() {
		// CAMBIO: Usamos .session en lugar de .local
		chrome.storage.session.get(["isLoggedIn", "userEmail"], (result) => {
			if (result.isLoggedIn) {
				loginView.classList.add("hidden");
				dashboardView.classList.remove("hidden");
			} else {
				dashboardView.classList.add("hidden");
				loginView.classList.remove("hidden");
			}
		});
	}

	// Ejecutamos la revisión al abrir el popup
	checkSession();

	// 2. INICIAR SESIÓN DESDE EL POPUP
	document.getElementById("go-to-not").addEventListener("click", () => {
		const email = document.querySelector('input[type="email"]').value;
		const password = document.querySelector('input[type="password"]').value;

		if (email.includes("@") && password.length > 0) {
			// CAMBIO: Usamos .session para guardar. ¡Al cerrar Chrome esto se esfumará!
			chrome.storage.session.set({ isLoggedIn: true, userEmail: email }, () => {
				checkSession();
			});
		} else {
			alert("Por favor ingresa un correo válido y una contraseña.");
		}
	});

	// 3. CERRAR SESIÓN
	// CAMBIO: Verificamos que el botón exista antes de agregarle el evento
	const logoutBtn = document.getElementById("logout-btn");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", () => {
			chrome.storage.local.remove(["isLoggedIn", "userEmail"], () => {
				// CAMBIO: Usamos document.querySelector en lugar de los IDs que no existen
				document.querySelector('input[type="email"]').value = "";
				document.querySelector('input[type="password"]').value = "";
				checkSession(); // Regresa a la vista de login
			});
		});
	}
});
