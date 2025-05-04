import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { CLIENT_PORT } from './config/ports.json';  // ← обратите внимание на .js

export default defineConfig({
  plugins: [react()],
  server: {
    port: CLIENT_PORT,
    strictPort: true,    // если порт занят — выдаст ошибку, а не переключится
  },
  
});
