# AI Studio ✨

A responsive and modern React web application that simulates a simplified AI image generation studio. This project demonstrates a complete front-end development workflow, including state management, asynchronous API handling with retries, client-side optimizations, and PWA capabilities.


---

### Features

-   **🖼️ Image Upload & Preview**: Upload PNG/JPG images (≤10MB) with a live preview.
-   **⚙️ Client-Side Resizing**: Automatically downscales images larger than 1920px on the client-side for performance.
-   **✍️ Prompt & Style**: Add a text prompt and select from multiple style options to guide the generation.
-   **🚀 Mock API Generation**: Simulates an API call with a 1-2 second delay and a 20% chance of a recoverable error.
-   **🔄 Automatic Retries**: On API failure, the app automatically retries with an exponential backoff strategy (up to 3 attempts).
-   **🛑 Abort In-Flight Requests**: Users can cancel an ongoing generation request at any time.
-   **🗂️ LocalStorage History**: Automatically saves the last 5 successful generations to `localStorage`.
-   **👀 Live Preview Card**: A dynamic card shows a real-time summary of the current image, prompt, and style.
-   **📱 PWA Ready**: The application is a fully installable Progressive Web App with offline caching.
-   **♿ Accessibility**: The app is keyboard-navigable with clear focus states and ARIA roles for better accessibility.

---

### Tech Stack

-   **Framework**: React 18 with Vite
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **Notifications**: React Hot Toast
-   **Linting/Formatting**: ESLint & Prettier

---

### Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

#### Prerequisites

You need to have Node.js (version 18.x or later) and npm installed on your machine.

#### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/prabhattopi/ai-fashion-studio](https://github.com/prabhattopi/ai-fashion-studio)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd ai-fashion-studio
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on `http://localhost:5173`.

---

### Project Structure

The project is organized with a clear and scalable folder structure:

```
/src
├── /components   # Reusable UI components (e.g., ImageUploader, PromptForm)
├── /lib          # Helper functions & API mocks (api.ts, imageUtils.ts)
├── App.tsx       # Main application component (state management & logic)
├── main.tsx      # Application entry point
└── index.css     # Global styles & Tailwind directives
```