# Cinematic Studio — Comfy Router guide

Build a short scene from simple cinematography controls, then call an image model through Comfy Router. The app shows the exact prompt it sends.

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

4. Open <http://localhost:3000>, describe a scene, pick the shot, camera, light and look, then select **Generate image**. Each run uses your workspace's Comfy credits at the current price for FLUX.2 Pro.

`COMFY_API_KEY` stays in the local server. Do not rename it with a `NEXT_PUBLIC_` prefix or commit `.env.local`.

## Follow the request

- [`components/app-runner.tsx`](components/app-runner.tsx) collects the controls and posts them to `/api/generate`.
- [`lib/prompt.ts`](lib/prompt.ts) combines the scene and direction choices into plain prompt text. Camera and lens names guide the image model through language; they do not simulate a real optical camera.
- [`app/api/generate/route.ts`](app/api/generate/route.ts) validates the request, configures the official Comfy TypeScript SDK with the server key, and calls the `bfl/flux-2-pro` Router model. It streams the returned image back to the page.
- Comfy Router calls a hosted model directly. This app does not submit a Comfy workflow graph. Re-shoot is the companion example that teaches workflow execution.

## Make a change

Add one option to a list in `lib/prompt.ts` and to its control in `components/app-runner.tsx`. The page preview shows the new words before generation, so you can see the effect of your edit without guessing what request was sent.

To try another Router model, first check its request fields in the [model catalog](https://docs.comfy.org/development/comfy-router/schemas). Change the model ID and request body in `app/api/generate/route.ts` together; Router models can have different parameters and output shapes. Then update [`lib/flux-output.ts`](lib/flux-output.ts) to read that model's output schema. This example expects an HTTPS image URL at `result.sample`; a different output shape will fail with “No image URL was returned.”

## If a run fails

- **Missing key:** make sure `.env.local` has `COMFY_API_KEY`, then restart `npm run dev`.
- **Insufficient credits or access:** check Router access and balance for the workspace that created the key.
- **Request validation:** this example sends only `prompt`. If you add model parameters, compare them with that model's schema.
- **Image unavailable:** Router returns provider output links. The server fetches the returned link and streams the bytes back to the browser; errors include the Comfy request ID when Router returned one.

This sample starts one Router request per click. Router runs can take a little while; the status text stays visible while the server request is in progress. The page keeps the latest output in memory, so reload clears it.

## License

This example is based on Comfy-Org's MIT-licensed [`img2img-web-app`](https://github.com/Comfy-Org/comfy-examples/tree/main/img2img-web-app). See [`LICENSE`](LICENSE).
