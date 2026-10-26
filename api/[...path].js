import { createApp } from '../server/app.js';
let app;
export default function handler(req, res) {
  if (!app) app = createApp();
  return app(req, res);
}
