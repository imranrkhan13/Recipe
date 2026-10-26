import { createApp } from './app.js';
const port = Number(process.env.PORT || 3001);
createApp().listen(port, '0.0.0.0', () => console.log(`Recipe API listening on ${port}`));
