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
   - Copy `.env` and set your site URL:
     ```
     NEXT_PUBLIC_SITE_URL=https://yourdomain.com
     ```
   - This is used for SEO, sitemap, and robots.txt.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```
   - After build, the `postbuild` script will automatically update `public/robots.txt` with your site URL.

2. **Start the server:**
   ```bash
   npm start
   ```

3. **SEO & Robots:**
   - `public/robots.txt` and the dynamic `/sitemap.xml` are automatically configured for your domain.
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
- `postbuild` – (runs automatically) Updates robots.txt with your site URL

---

## Customization

- **Add/Remove Quiz Questions**: Edit question components in `src/components/questions/`.
- **AI Story Logic**: See `src/services/gemini-service.ts` and `src/services/story-service.ts`.
- **Theme**: Customize Tailwind and theme in `src/styles/theme.ts` and `globals.css`.

---

## Deployment to Vercel

You can deploy this project to [Vercel](https://vercel.com/) for fast, serverless hosting.

**Steps:**
1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import your repository into Vercel.
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard to your production domain (e.g., `https://yourdomain.com`).
4. Vercel will handle builds, deployments, and serverless hosting automatically.
5. [Optional] Set up a custom domain in Vercel for your site.

*Add any additional Vercel-specific notes or custom steps here as needed.*

---

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss major changes.

---

## License

[MIT](LICENSE)
