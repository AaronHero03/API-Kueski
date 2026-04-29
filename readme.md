# Kueski Pay - Asistente de Compras: Complete Documentation

## 1. General Architecture

The project follows a client-server architecture, dividing the code into two fundamental components to separate the user interface from secure processing logic.

### A. `kueski-api-gateway` (Backend / Server)

- **Purpose:** This folder contains the server or API Gateway. It acts as the communication bridge between the browser extension and Kueski's internal services/databases.
- **Key Function:** Its main job is to receive requests made by the extension (such as checking balances, registering cashback, or validating information), securely process the business logic, and return the data for the extension to display. Keeping this separate helps protect sensitive information and credentials that should not reside in the user's browser.

### B. `kueski_extension` (Frontend / Client)

- **Purpose:** This folder contains all the source code for the Chrome extension that the end-user interacts with (the "Shopping Assistant").
- **Key Function:** It is responsible for everything that happens within the browser. Here you will find the visual interface (`popup` folder), images and icons (`assets` folder), and scripts (`background` and `content_scripts`) that read the context of store pages to show useful, real-time information.

---

## 2. Extension Detailed Structure (`kueski_extension`)

The extension is organized as a standard Manifest V3 Chrome extension.

### Root Configuration

- **`manifest.json`**: The core configuration file. It defines the extension's name, version (1.0.0), required permissions (`storage`, `tabs`), host permissions (`https://*/*`), and the entry points for background and content scripts.
- **`package.json`**: A standard Node.js configuration file defining the project name, version, and dependencies.

### User Interface (`/popup`)

This directory contains the front-end components of the extension's user interface (the Control Center).

- **`popup.html`**: The structural foundation of the UI. It displays the user's total balance, accumulated cashback, and store-specific rewards.
- **`styles.css`**: Contains the visual logic and styling, using gradients and specific brand colors to create a modern financial app aesthetic.
- **`normalize.css`**: A utility file used to ensure the extension looks consistent regardless of the user's browser settings.
- **`kueski.png`**: The primary branding asset displayed at the top of the control center.

### Assets and Icons (`/assets`)

This folder serves as the repository for all static resources and metadata-related imagery required by the browser and the web store.

- **`icons/icon48.png`**: The standard icon used in the Chrome extension toolbar.
- **`icons/android-chrome-192x192.png` & `512x512.png`**: High-resolution versions of the logo.
- **`icons/favicon.ico`**: The standard browser favicon.
- **`icons/apple-touch-icon.png`**: An icon specifically formatted for iOS and macOS devices.

### Functional Scripts

- **`background/background.js`**: A service worker that runs in the background to handle browser events and maintain the extension's state.
- **`content/content-script.js`**: A script that runs on all web pages (`https://*/*`) to interact with store websites and provide real-time information.

---

## 3. Key Technical Specifications

- **Manifest Version:** 3
- **Permissions:** `storage` (to save user data) and `tabs` (to interact with active browser pages).
- **Host Permissions:** Configured to run on all secure websites (`https://*/*`) to ensure the shopping assistant works across various online retailers.
