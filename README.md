# Chefy.Y

Chefy.Y is a Next.js app that turns your available ingredients into practical recipes, with a built-in cooking assistant and substitution helper.

## Features

- AI recipe generation from ingredient input
- Preferred cooking method cards + custom method support
- Cooking time templates + custom time support
- Ingredient substitution assistant
- Global floating cooking assistant chat
- Save favorite recipes and view history
- Export/import generated recipes as JSON
- Light/dark theme support

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui components
- Groq API for AI responses

## Requirements

- Node.js 18+ (recommended: current LTS)
- pnpm
- A valid `GROQ_API_KEY`

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

3. Run the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start local dev server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint (requires `eslint` to be available in your environment)

## App Routes

- `/` - landing page
- `/recipes` - recipe generator
- `/saved` - saved recipes
- `/history` - chat history
- `/privacy` - privacy policy
- `/terms` - terms of service

## API Routes

- `POST /api/generate-recipes` - generate recipe list from inputs
- `POST /api/chat` - cooking assistant responses
- `POST /api/substitution` - ingredient substitution suggestions

## Notes

- Recipes and chat history are stored locally in browser storage.
- If your API key was exposed, rotate it immediately in Groq dashboard and update `.env`.

