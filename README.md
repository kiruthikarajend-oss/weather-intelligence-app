# Weather Intelligence App

A smart, full-stack weather application with 7-day forecasting and AI-generated activity recommendations. Built with React, Tailwind CSS, Vite, Express, and the Gemini API.

## Features
- **Location Geocoding & Search**: Find any city worldwide using the Open-Meteo Geocoding API.
- **Dynamic Weather Dashboards**: Real-time statistics, hourly temperature graphs, and 7-day forecasts.
- **AI Daily Recommendations**: Personalized activity planning generated securely via the Gemini API.
- **Responsive UI**: Polished, responsive single-view layout with animated transitions.

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`.

## Exporting from AI Studio to GitHub

To move this project from Google AI Studio to your own GitHub repository:

1. In the AI Studio editor, locate the **Export/Settings** menu (usually found in the top right or file explorer).
2. Select **Export to GitHub** (or download the project as a ZIP file).
3. If using the GitHub integration, authorize AI Studio and select the repository name to push directly.
4. If downloading as a ZIP, extract the files locally, initialize a git repository (`git init`), commit the files, and push them to a new repository on your GitHub account.

## Deployment Instructions

### Important Architecture Note
This application uses a **Full-Stack Architecture**:
- **Frontend**: React (Vite)
- **Backend**: Node.js (Express) used to securely proxy Gemini API calls.

### Deploying to Cloudflare Pages (Frontend Only)
Cloudflare Pages is excellent for static and frontend hosting. Because this app includes a Node.js Express backend (`server.ts`), deploying *as-is* to Cloudflare Pages will only serve the static React frontend. The `/api/recommendations` endpoint will fail unless the backend is hosted elsewhere or converted to Cloudflare Functions.

To deploy the frontend to Cloudflare Pages:
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** -> **Pages** -> **Connect to Git**.
3. Select your exported GitHub repository.
4. Configure the build settings:
   - **Framework preset**: `None` (or `Vite`)
   - **Build command**: `npx vite build` (Overrides the default full-stack build script)
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

### Full-Stack Deployment Alternatives (Recommended)
To run both the React frontend and the Express backend together without modifying the code, we recommend deploying to a Node.js-compatible container host such as **Google Cloud Run**, **Render**, or **Railway**:

1. Connect your GitHub repository to your chosen platform.
2. Set the build command: `npm run build`
3. Set the start command: `npm run start`
4. Add your `GEMINI_API_KEY` as an environment variable in the platform's dashboard.
5. Deploy! The platform will automatically build the React app and start the Express server on the provided port.
