import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // سنرفع الحد فقط ليختفي التحذير البرتقالي ولا يتعطل الموقع
    chunkSizeWarningLimit: 2000,
  },
});
