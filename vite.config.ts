import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // هذا السطر يرفع حد التحذير لـ 1600kb ليختفي اللون البرتقالي
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // هذا الجزء يقسم المكتبات الكبيرة لملفات أصغر لتحسين الأداء
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
