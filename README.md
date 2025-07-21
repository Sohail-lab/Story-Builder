# Fantasy Story Builder

An interactive, AI-powered fantasy story-building quiz. Players answer questions to help generate a personalized fantasy world and narrative.

---

## Features

- **Interactive Character Creation**: Dynamic quiz for building your fantasy persona.
- **AI-Powered Story Generation**: Personalized stories crafted from your answers.
- **Rich Fantasy Theme**: Custom fonts, magical effects, and responsive design.
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation.
- **SEO Optimized**: Open Graph, Twitter cards, sitemap, robots.txt, and structured data.
- **Performance**: Code splitting, lazy loading, and image optimization.
- **TypeScript**: Strict typing throughout.
- **Error Handling**: Robust error boundaries and validation.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, custom fantasy theme
- **Animation**: Framer Motion
- **State**: Zustand
- **Forms/Validation**: React Hook Form + Zod
- **AI**: Google Generative AI
- **TypeScript**: Strict mode

---

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API routes
├── components/    # UI components (by feature)
├── hooks/         # Custom React hooks
├── services/      # API and AI service logic
├── stores/        # Zustand state stores
├── types/         # TypeScript types
├── utils/         # Utility functions
└── styles/        # Theme and global styles
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env` and set the site URL and Gemini API key:
     ```
     NEXT_PUBLIC_SITE_URL=https://fantasy-story-builder.vercel.app/
     NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key
     ```
   - These are used for SEO, sitemap, robots.txt, and AI story generation.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in a browser.

---

## Production Build & Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```
   - After build, the `postbuild` script will automatically update `public/robots.txt` with the site URL.

2. **Start the server:**
   ```bash
   npm start
   ```

3. **SEO & Robots:**
   - `public/robots.txt` and the dynamic `/sitemap.xml` are automatically configured for the deployment domain.
   - Update `NEXT_PUBLIC_SITE_URL` in `.env` for each environment (local, staging, production).

---

## SEO & Accessibility

- **Meta Tags**: Open Graph, Twitter, favicon, and theme color.
- **Structured Data**: JSON-LD for rich search results.
- **Sitemap**: `/sitemap.xml` is generated dynamically.
- **robots.txt**: Automatically updated at build time.
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML.

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Lint code
- `postbuild` – (runs automatically) Updates robots.txt with the site URL

---

## Customization

- **Add/Remove Quiz Questions**: Edit question components in `src/components/questions/`.
- **AI Story Logic**: See `src/services/gemini-service.ts` and `src/services/story-service.ts`.
- **Theme**: Customize Tailwind and theme in `src/styles/theme.ts` and `globals.css`.

---

## Deployment

This project is designed for seamless deployment on modern serverless platforms such as [Vercel](https://vercel.com/).

**Live Example:**
- [https://fantasy-story-builder.vercel.app/](https://fantasy-story-builder.vercel.app/)

**Deployment Notes:**
- The environment variable `NEXT_PUBLIC_SITE_URL` should be set to the production URL (e.g., `https://fantasy-story-builder.vercel.app/`).
- The environment variable `NEXT_PUBLIC_GEMINI_API_KEY` must be set for AI-powered story generation.
- After deployment, SEO and robots.txt configuration will automatically use the correct domain.
- A custom domain can be configured if desired.

---

## Contributing

Pull requests and issues are welcome. Please open an issue to discuss major changes.

---

## License

[MIT](LICENSE)
