import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// export default defineConfig(() => {
//   // Cấu hình khác của Vite
//   return {
//     plugins: [react()],
//     server: {
//       port: 5002
//     },
//     css: {
//       devSourcemap: true
//     },
//     resolve: {
//       alias: {
//         src: path.resolve(__dirname, './src')
//       }
//     }
//   }
// })

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 5002
    },
    css: {
      devSourcemap: mode === 'development'
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src')
      }
    }
  }
})
