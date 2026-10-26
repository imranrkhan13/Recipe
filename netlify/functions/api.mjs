import http from 'node:http';
import { createApp } from '../../server/app.js';

// Runs the same Express app used on Vercel and locally behind Netlify Functions.
// The app listens on a private loopback port inside the function instance and each
// request is forwarded to it with its original Host, Origin and Cookie headers.
// Client IP: the app trusts exactly one proxy hop, and that hop is this file. Any
// client-supplied X-Forwarded-For is dropped and replaced with the IP Netlify reports.
process.env.TRUST_PROXY ||= '1';
process.env.NODE_ENV ||= 'production';
let ready;
function start() {
  ready ||= new Promise((resolve, reject) => {
    const server = http.createServer(createApp());
    server.on('error', error => { ready = undefined; reject(error); });
    server.on('close', () => { ready = undefined; });
    server.listen(0, '127.0.0.1', () => { server.unref(); resolve(server.address().port); });
  });
  return ready;
}

export default async function handler(request, context) {
  const port = await start();
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers);
  headers.host = url.host;
  delete headers.connection;
  delete headers['x-forwarded-for'];
  delete headers.forwarded;
  const ip = context?.ip || request.headers.get('x-nf-client-connection-ip');
  if (ip) headers['x-forwarded-for'] = ip;
  delete headers['content-length'];
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : Buffer.from(await request.arrayBuffer());
  if (body) headers['content-length'] = String(body.length);
  return new Promise(resolve => {
    const upstream = http.request({ host: '127.0.0.1', port, method: request.method, path: url.pathname + url.search, headers }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const out = new Headers();
        for (const [key, value] of Object.entries(res.headers)) {
          if (key === 'transfer-encoding' || key === 'connection') continue;
          for (const item of Array.isArray(value) ? value : [value]) out.append(key, item);
        }
        const status = res.statusCode || 502;
        resolve(new Response([204, 304].includes(status) ? null : Buffer.concat(chunks), { status, headers: out }));
      });
    });
    upstream.on('error', () => resolve(Response.json({ error: 'Server error' }, { status: 502, headers: { 'Cache-Control': 'no-store' } })));
    upstream.end(body);
  });
}

export const config = { path: '/api/*' };
