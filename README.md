# Cinematic Studio

A standalone app for generating cinematic images with Comfy Router.

## Run locally

1. Install [Node.js 22.6 or newer](https://nodejs.org/) and create a [Comfy API key](https://platform.comfy.org/profile/api-keys?onboarding=router) for a workspace with Router access and credits.
2. Clone and configure the app:

   ```sh
   git clone https://github.com/Comfy-Org/comfy-cinematic-studio.git
   cd comfy-cinematic-studio
   cp .env.example .env.local
   ```

3. Put your key in `COMFY_API_KEY` in `.env.local`, then install and start:

   ```sh
   npm ci
   npm run dev
   ```

4. Open <http://localhost:3000>, describe a scene, choose the shot, camera, light, and look, then select **Generate image**. Each run uses Comfy credits from the workspace that owns the API key.

Keep `COMFY_API_KEY` in `.env.local`; only the server route reads it. Do not prefix it with `NEXT_PUBLIC_` or commit the file.

## Request flow

**Generate image** posts the scene and selected shot, camera, lighting, and look to `/api/generate`. The route validates these values, combines them into a prompt with `cinematicPrompt()` in `lib/prompt.ts`, and calls `bfl/flux-2-pro` through the Comfy SDK. The server fetches the result and returns the image to the browser.

This app uses Comfy Router's hosted model API. It does not submit a Comfy workflow.

## Make a change

Add the option to the corresponding list in `lib/prompt.ts` and add a matching `<option>` in `components/app-runner.tsx`. The prompt preview and API route both call `cinematicPrompt()` from `lib/prompt.ts`.

`app/api/generate/route.ts` calls `bfl/flux-2-pro` with a prompt. To use another model, update the model ID and parameters to match its [schema](https://docs.comfy.org/development/comfy-router/schemas), then update `lib/flux-output.ts` for its response. The current parser reads an HTTPS image URL from `result.sample`.

## If a run fails

- **Missing key:** make sure `.env.local` has `COMFY_API_KEY`, then restart `npm run dev`.
- **Insufficient credits or access:** check Router access and balance for the workspace that created the key.
- **Image unavailable:** if Router returns no usable image, the error includes its request ID when available.

## License

MIT. See [`LICENSE`](LICENSE).
