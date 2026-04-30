const currentDomain = window.location.hostname.replace("www.", "");

// 2. Le mandamos un mensaje al "cerebro" (Background Script)
chrome.runtime.sendMessage(
	{ type: "CHECK_STORE", payload: { domain: currentDomain } },
	(response) => {
		if (response && response.is_partner) {
			// 3. Revisar si el usuario ya inició sesión ANTES de inyectar nada
			chrome.storage.session.get(["isLoggedIn"], (result) => {
				if (!result.isLoggedIn) {
					// Si NO hay sesión activa, mostramos la invitación
					showKueskiPopup(response.cashback_percentage, currentDomain);
				} else {
					// Si YA hay sesión activa, evitamos molestar al usuario.
					// Opcional: Podrías hacer un console.log para tus pruebas
					console.log(
						"KueskiPay: Cashback activo, usuario ya logeado. Popup silenciado.",
					);

					// OJO: En un futuro, en lugar de no hacer nada, aquí podrías
					// llamar a otra función que inyecte un botón súper chiquito y discreto
					// en la esquina que diga "Kueski: 5% Cashback activado ✅"
				}
			});
		}
	},
);
function showKueskiPopup(cashbackPercentage, domain) {
	// Evitar inyectar múltiples veces
	if (document.getElementById("kueski-extension-root")) return;

	// Contenedor principal flotante
	const container = document.createElement("div");
	container.id = "kueski-extension-root";
	container.style.position = "fixed";
	container.style.top = "0px";
	container.style.right = "20px";
	container.style.zIndex = "99999999";

	// Aislamos los estilos con Shadow DOM
	const shadow = container.attachShadow({ mode: "open" });

	// Obtenemos la URL de tu logo (recuerda ponerlo en web_accessible_resources en el manifest)
	const logoUrl = chrome.runtime.getURL("assets/kueski.png");

	// Todo tu CSS (sin el grid del body)
	const styles = `
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap");

      @keyframes kueskiSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      * { box-sizing: border-box; }

      .kueski-popup {
        font-family: "Instrument Sans", sans-serif;
        background: #ffffff;
        aspect-ratio: 3/4;
        width: 360px;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        animation: kueskiSlideIn 0.5s ease-out forwards;
      }

      /* MODIFICADOR DE PROPORCIÓN PARA TARJETA NUEVA */
      .ratio-5-7 { aspect-ratio: 5/7; width: 340px; }

      .popup-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
      .logo { height: 28px; width: auto; }
      
      .close-btn { background: none; border: none; font-size: 30px; color: #a3a3a3; cursor: pointer; line-height: 0.8; padding: 0; }
      .close-btn:hover { color: #666666; }

      .popup-head { text-align: center; margin-bottom: 16px; }
      .popup-head img { width: 120px; }

      /* UTILIDAD PARA CENTRAR TEXTOS */
      .text-center { text-align: center; }

      .popup-content h1 { font-size: 26px; font-weight: 700; color: #000000; line-height: 1.2; margin-top: 0; margin-bottom: 20px; margin-top: 20px;}
      .popup-content h2 { font-size: 18px; font-weight: 700; color: #000000; margin-top: 0; margin-bottom: 24px; }
      .popup-content p { font-size: 17px; font-weight: 400; color: #111111; line-height: 1.4; margin-top: 0; margin-bottom: 20px; }
      .popup-content p:last-of-type { margin-bottom: 24px; }

      .primary-btn { background-color: #2b95fa; color: #ffffff; border: none; font-weight: 600; font-family: inherit; font-size: 16px; border-radius: 8px; padding: 16px; width: 100%; cursor: pointer; transition: background-color 0.2s ease; }
      .primary-btn:hover { background-color: #1c81df; }

      .secondary-btn { text-align: left; margin-bottom: 20px; }
      
      .forms { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 4px; }
      .field { border: 1px solid rgb(214, 214, 214); font-family: inherit; font-size: 16px; border-radius: 8px; padding: 16px; width: 100%; }
      
      .secondary-text { text-decoration: none; font-size: 15px; }
      .emphatize { font-weight: bold; color: #00aaff; }
      .rounded { border-radius: 50px; }

      .successful-logo { width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; flex-direction: column; text-align: center; font-weight: 500; font-size: 17px; }

      /* CIRCULO MODIFICADO (BASE) */
      .circle { width: 125px; border-radius: 50%; aspect-ratio: 1/1; border: 4px solid #3baaf8; box-shadow: 0 0 25px rgba(59, 170, 248, 0.4); display: flex; margin-bottom: 20px; align-items: center; justify-content: center; }

      /* MODIFICADOR DE CÍRCULO AMARILLO */
      .warning-circle { border-color: #fce21d; box-shadow: 0 0 25px rgba(252, 226, 29, 0.4); }
      .warning-icon { font-size: 55px; font-weight: 700; color: #222222; }
      .checkmark-svg { width: 55px; height: auto; color: #49d233; }

      /* CLASES PARA INFO DE USUARIO */
      .user-profile { display: flex; align-items: center; gap: 12px; margin-top: 24px; text-align: left; }
      .user-icon-svg { width: 45px; height: 45px; color: #2b95fa; }
      .user-details { display: flex; flex-direction: column; }
      .user-name { font-size: 15px; font-weight: 600; color: #000000; }
      .user-email { font-size: 14px; color: #8f8f8f; font-weight: 400; }
      #not-account { margin-top: 20px; text-align: center;}

      /* CLASES PARA CAJA DE DESGLOSE */
      .breakdown-box { text-align: left; margin-bottom: 20px; }
      .breakdown-box h3 { margin-top: 0; font-size: 15px; font-weight: 600; margin-bottom: 8px; color: #000000; }
      .breakdown-box p { font-size: 14px; color: #222222; margin-bottom: 4px; font-weight: 400; margin-top: 0; }
      .breakdown-box p:last-child { margin-bottom: 0; }
    </style>
  `;
	// El HTML de la primera tarjeta (Notificación)
	const notificationHTML = `
    <div class="kueski-popup" id="notification">
      <div class="popup-header">
        <img src="${logoUrl}" alt="Kueski" class="logo" />
        <button class="close-btn" aria-label="Cerrar" id="close-kueski">&times;</button>
      </div>

      <div class="popup-content">
        <h1>¡Atención, Cashback activo!</h1>
        <h2>KueskiPay ha detectado beneficios</h2>
        <p>
          ¡Felicidades! Gana un <strong>${cashbackPercentage}%</strong> de cashback en tus compras de
          <span style="text-transform: capitalize; font-weight: bold;">${domain}</span> con KueskiPay.
        </p>
        <p>Inicia sesión para recibir tus beneficios y ver más ofertas.</p>
      </div>

      <button class="primary-btn" id="go-to-login">
        Inicia Sesión en KueskiPay
      </button>
    </div>
  `;
	// El HTML de la segunda tarjeta (Login) - Lo guardamos para usarlo después
	const loginHTML = `
    <div class="kueski-popup" id="login">
      <div class="popup-header">
        <span></span>
        <button class="close-btn" aria-label="Cerrar" id="close-kueski-login">&times;</button>
      </div>
      <div class="popup-head">
        <img src="${logoUrl}" alt="Kueski" />
        <h2>Inicia sesión</h2>
      </div>
      <div class="forms">
        <input type="email" placeholder="Correo electrónico" class="field" />
        <input type="password" placeholder="Contraseña" class="field" />
      </div>
      <div class="secondary-btn">
        <a href="#" class="secondary-text emphatize">¿Olvidaste tu contraseña?</a>
      </div>
      <button class="primary-btn rounded" id="submit-login">Iniciar sesión</button>
      <div id="not-account" class="secondary-text">
        ¿Aun no tienes cuenta? <a href="#" class="emphatize secondary-text">Crear una cuenta</a>
      </div>
    </div>
  `;
	// HTML de la tajeta Successful
	const successfulHTML = `
	<div class="kueski-popup" id="successful">
		<div class="popup-header">
			<span></span>
			<button class="close-btn" aria-label="Cerrar" id="close-kueski-success">
				&times;
			</button>
		</div>

		<div class="popup-head">
			<img src="${logoUrl}" alt="Kueski" />
			<h2>¡Bienvenido de nuevo!</h2>
		</div>

		<div class="successful-logo">
			<div class="circle">
				<svg
					class="checkmark-svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
			</div>
			<p>Sesión iniciada con éxito en tu cuenta Kueski</p>

			<div class="user-profile">
				<svg
					class="user-icon-svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
					<circle cx="12" cy="7" r="4"></circle>
				</svg>
				<div class="user-details">
					<span class="user-name">Hola, KueskiUser.</span>
					<span class="user-email">juanm123@gmail.com</span>
				</div>
			</div>
		</div>
	</div>;`;

	// Creamos un contenedor interno para poder cambiar las vistas fácilmente
	const viewContainer = document.createElement("div");
	viewContainer.innerHTML = notificationHTML;

	// Inyectamos todo al Shadow DOM
	shadow.innerHTML = styles;
	shadow.appendChild(viewContainer);
	document.body.appendChild(container);
	// --- LÓGICA DE EVENTOS ---

	// Función para cerrar el popup
	const closePopup = () => container.remove();

	shadow.querySelector("#close-kueski").addEventListener("click", closePopup);

	shadow.querySelector("#go-to-login").addEventListener("click", () => {
		viewContainer.innerHTML = loginHTML;

		shadow
			.querySelector("#close-kueski-login")
			.addEventListener("click", closePopup);

		shadow.querySelector("#submit-login").addEventListener("click", () => {
			const emailInput = shadow.querySelector('input[type="email"]').value;
			const passwordInput = shadow.querySelector(
				'input[type="password"]',
			).value;

			// Validación súper básica
			if (emailInput.includes("@") && passwordInput.length > 0) {
				// Guardamos en el almacenamiento de Chrome
				chrome.storage.session.set(
					{
						isLoggedIn: true,
						userEmail: emailInput,
					},
					() => {
						console.log("Mock de sesión guardado con éxito.");

						viewContainer.innerHTML = successfulHTML;
						shadow.querySelector(".user-email").textContent = emailInput;

						shadow
							.querySelector("#close-kueski-success")
							.addEventListener("click", closePopup);
					},
				);
			} else {
				console.log("Por favor ingresa un correo válido y una contraseña.");
				alert("Por favor ingresa un correo y contraseña válidos.");
			}
		});
	});
}
