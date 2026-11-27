import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          leadership: path.resolve(__dirname, 'leadership.html'),
          experience: path.resolve(__dirname, 'experience.html'),
          telecomPortfolio: path.resolve(__dirname, 'telecom-portfolio.html'),
          aiPortfolio: path.resolve(__dirname, 'ai-portfolio.html'),
          projectManagement: path.resolve(__dirname, 'project-management.html'),
          certificates: path.resolve(__dirname, 'certificates.html'),
          articles: path.resolve(__dirname, 'articles.html'),
          podcasts: path.resolve(__dirname, 'podcasts.html'),
          knowledgeCenter: path.resolve(__dirname, 'knowledge-center.html'),
          resume: path.resolve(__dirname, 'resume.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
