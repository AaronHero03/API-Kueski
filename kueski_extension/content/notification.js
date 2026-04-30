function showKueskiPopup(cashback, storeName) {
	const container = document.createElement("div");
	container.id = "kueski-main-container";
	container.style = `
    position: fixed; 
    top: 0px; 
    right: 20px; 
    z-index: 999999;
    background: white; 
    width: 340px; 
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    overflow: hidden; 
    transition: all 0.3s ease;
  `;
	document.body.appendChild(container);

	const renderBenefitView = () => {
		container.innerHTML = `
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap");

      /* 1. DEFINIR LA ANIMACIÓN (Keyframes) */
      @keyframes kueskiSlideIn {
        from {
          opacity: 0;
          transform: translateY(20px); /* Empieza 20px abajo */
        }
        to {
          opacity: 1;
          transform: translateY(0);    /* Termina en su posición original */
        }
      }

      #kueski-extension-wrapper * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      #kueski-extension-wrapper {
        font-family: "Instrument Sans", sans-serif;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #kueski-extension-wrapper .kueski-popup {
        background: #ffffff;
        aspect-ratio: 3/4;
        width: 340px;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;

        /* 2. APLICAR LA ANIMACIÓN AL CONTENEDOR */
        animation: kueskiSlideIn 0.5s ease-out forwards;
        
        /* Asegurar que empiece invisible antes de que la animación corra */
        opacity: 0; 
      }

      /* ... Resto de tus estilos CSS se mantienen igual ... */
      #kueski-extension-wrapper .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 42px;
      }

      #kueski-extension-wrapper .logo {
        height: 28px;
        width: auto;
      }

      #kueski-extension-wrapper .close-btn {
        background: none;
        border: none;
        font-size: 30px;
        color: #a3a3a3;
        cursor: pointer;
        line-height: 0.8;
        padding: 0;
      }

      #kueski-extension-wrapper .close-btn:hover {
        color: #666666;
      }

      #kueski-extension-wrapper .popup-content h1 {
        font-size: 26px;
        font-weight: 700;
        color: #000000;
        line-height: 1.2;
        margin-bottom: 16px;
      }

      #kueski-extension-wrapper .popup-content h2 {
        font-size: 18px;
        font-weight: 700;
        color: #000000;
        margin-bottom: 24px;
      }

      #kueski-extension-wrapper .popup-content p {
        font-size: 16px;
        font-weight: 400;
        color: #111111;
        line-height: 1.4;
        margin-bottom: 16px;
      }

      #kueski-extension-wrapper .popup-content p:last-of-type {
        margin-bottom: 24px;
      }

      #kueski-extension-wrapper .primary-btn {
        background-color: #2b95fa;
        color: #ffffff;
        font-family: inherit;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        padding: 16px;
        width: 100%;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      #kueski-extension-wrapper .primary-btn:hover {
        background-color: #1c81df;
      }
    </style>

    <div id="kueski-extension-wrapper">
      <div class="kueski-popup">
        <div class="popup-header">
          <img src="${chrome.runtime.getURL("assets/kueski.png")}" alt="Kueski" class="logo" />
          <button class="close-btn" id="close-kueski" aria-label="Cerrar">&times;</button>
        </div>

        <div class="popup-content">
          <h1>¡Atención, Cashback activo!</h1>
          <h2>KueskiPay ha detectado beneficios</h2>

          <p>
            ¡Felicidades! Gana un ${cashback}% de cashback en tus compras de <span style="text-transform: capitalize;">${storeName.split(".")[0]}</span> con
            KueskiPay.
          </p>
          <p>Inicia sesión para recibir tus beneficios y ver más ofertas.</p>
        </div>

        <button class="primary-btn" id="go-to-login">Inicia Sesión en KueskiPay</button>
      </div>
    </div>
  `;

		document.getElementById("close-kueski").onclick = () => container.remove();
		document.getElementById("go-to-login").onclick = () => renderLoginView();
	};

	const renderLoginView = () => {
		container.innerHTML = `
      <div style="padding: 30px; position: relative;">
        <span id="close-x" style="position: absolute; right: 20px; top: 15px; cursor: pointer; color: #ccc; font-size: 20px;">&times;</span>
        
        <div style="text-align: center; margin-bottom: 25px;">
           <img src="${chrome.runtime.getURL("assets/kueski.png")}" style="width: 120px;">
           <h2 style="font-size: 22px; color: #1a1a1a; margin-top: 20px;">Inicia sesión</h2>
        </div>

        <input type="email" placeholder="Correo electrónico" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
        <input type="password" placeholder="Contraseña" style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
        
        <div style="text-align: left; margin-bottom: 20px;">
          <a href="#" style="color: #00aaff; text-decoration: none; font-size: 14px; font-weight: bold;">¿Olvidaste tu contraseña?</a>
        </div>

        <button id="go-to-not" style="background: #00aaff; color: white; border: none; padding: 14px; border-radius: 30px; width: 100%; font-size: 16px; font-weight: bold;">Iniciar sesión</button>
        
        <div style="margin-top: 20px; font-size: 14px; color: #666; text-align: center;">
          ¿Aun no tienes cuenta? <a href="#" style="color: #00aaff; text-decoration: none; font-weight: bold;">Crear una cuenta</a>
        </div>
      </div>
    `;

		// Lógica para cerrar
		document.getElementById("close-x").onclick = () => container.remove();
		document.getElementById("go-to-not").onclick = () => renderBenefitView();
	};

	renderBenefitView();
}
