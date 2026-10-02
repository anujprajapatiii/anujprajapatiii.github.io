import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:process.env.BASE_PATH||'/',plugins:[react()],build:{rollupOptions:{onwarn(warning,warn){if(warning.code==='MODULE_LEVEL_DIRECTIVE')return;warn(warning)},output:{manualChunks:{'base-ui':['@base-ui/react/dialog','@base-ui/react/tabs','@base-ui/react/accordion','@base-ui/react/checkbox','@base-ui/react/switch','@base-ui/react/slider','@base-ui/react/progress','@base-ui/react/select','@base-ui/react/radio-group','@base-ui/react/radio']}}}}});
