# Cinematic Studio — Comfy Router guide

Create an image with shot, lens, lighting, and style controls. The app combines those choices with your scene description and sends the prompt to FLUX.2 Pro through Comfy Router.

## Run locally

1. Install [Node.js 22.6 or newer](https://nodejs.org/) and create a [Comfy API key](https://docs.comfy.org/development/comfy-router/quickstart) for a workspace with Router access and credits.
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

`COMFY_API_KEY` stays in the local server. Do not rename it with a `NEXT_PUBLIC_` prefix or commit `.env.local`.

## Request flow

**Generate image** posts the scene and selected shot, camera, lighting, and look to `/api/generate`. The route validates these values, combines them into a prompt with `cinematicPrompt()` in `lib/prompt.ts`, and calls `bfl/flux-2-pro` through the Comfy SDK. The server fetches the result and returns the image to the browser.

This example uses Comfy Router's hosted model API. It does not submit a Comfy workflow.

## Make a change

Add the option to the corresponding list in `lib/prompt.ts` and add a matching `<option>` in `components/app-runner.tsx`. The prompt preview and API route both call `cinematicPrompt()` from `lib/prompt.ts`.

To try another Router model, first check its request fields in the [model catalog](https://docs.comfy.org/development/comfy-router/schemas). Change the model ID and request body in `app/api/generate/route.ts` together; Router models can have different parameters and output shapes. Then update [`lib/flux-output.ts`](lib/flux-output.ts) to read that model's output schema. This example expects an HTTPS image URL at `result.sample`; a different output shape will fail with “No image URL was returned.”

## If a run fails

- **Missing key:** make sure `.env.local` has `COMFY_API_KEY`, then restart `npm run dev`.
- **Insufficient credits or access:** check Router access and balance for the workspace that created the key.
- **Request validation:** this example sends only `prompt`. If you add model parameters, compare them with that model's schema.
- **Image unavailable:** Router returns provider output links. The server fetches the returned link and streams the bytes back to the browser; errors include the Comfy request ID when Router returned one.

The page holds the latest image in memory. Reloading clears it.

## License

This example is based on Comfy-Org's MIT-licensed [`img2img-web-app`](https://github.com/Comfy-Org/comfy-examples/tree/main/img2img-web-app). See [`LICENSE`](LICENSE).
