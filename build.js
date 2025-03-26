const fs = require('fs-extra');
const { exec } = require('child_process');

async function buildProcess() {
  try {
    // Clean build directory
    await fs.remove('./build');
    
    // Build React app
    await new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(stdout);
        resolve();
      });
    });

    // Copy static assets
    await fs.copy('./public/assets', './build/assets');

    // Create robots.txt
    const robotsTxt = `
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
    `.trim();
    await fs.writeFile('./build/robots.txt', robotsTxt);

    // Create sitemap.xml
    const sitemapXml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Add other URLs -->
</urlset>
    `.trim();
    await fs.writeFile('./build/sitemap.xml', sitemapXml);

    console.log('Build process completed successfully!');
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

buildProcess(); 