// build.js
import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';

const outdir = 'dist';
const entrypoint = 'index.tsx';
const htmlSource = 'index.html';
const htmlDest = path.join(outdir, 'index.html');
const jsDest = path.join(outdir, 'index.js');

async function buildApp() {
  console.log('Starting build process...');
  // Create output directory
  await fs.mkdir(outdir, { recursive: true });
  console.log(`Created output directory: ${outdir}`);

  // Build TSX with esbuild
  console.log(`Bundling ${entrypoint} with esbuild...`);
  await esbuild.build({
    entryPoints: [entrypoint],
    bundle: true,
    outfile: jsDest,
    loader: { '.tsx': 'tsx' },
    // These are external because they are loaded via importmap in index.html
    external: ['react', 'react-dom/client', 'react/*', '@google/genai', 'marked'],
    format: 'esm', // Ensure ES module output
    sourcemap: true, // For better debugging
    // Define process.env.API_KEY for browser environment
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    },
    // minify: true, // Uncomment for production minification
  });
  console.log(`Bundling complete. Output: ${jsDest}`);

  // Read original index.html
  console.log(`Reading original HTML: ${htmlSource}`);
  let htmlContent = await fs.readFile(htmlSource, 'utf-8');

  // Replace script tag reference from .tsx to .js
  console.log('Updating script tag in HTML...');
  htmlContent = htmlContent.replace(
    '<script type="module" src="/index.tsx"></script>',
    '<script type="module" src="/index.js"></script>'
  );

  // Write modified index.html to dist
  console.log(`Writing modified HTML to: ${htmlDest}`);
  await fs.writeFile(htmlDest, htmlContent);

  console.log('Build successful!');
}

buildApp().catch(error => {
  console.error('Build failed:', error);
  process.exit(1); // Exit with a non-zero code to indicate failure
});