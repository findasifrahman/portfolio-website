const fs = require('fs');
const path = require('path');

// Create necessary directories
const dirs = [
  'public/assets/img/projects',
  'public/assets/img/products'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy profile picture
const profilePic = 'scraped_data/images/linkedin/profile_pic.jpg';
if (fs.existsSync(profilePic)) {
  fs.copyFileSync(profilePic, 'public/assets/img/profile.jpg');
}

// Copy project images
const projectDirs = [
  { src: 'scraped_data/images/app', dest: 'public/assets/img/projects' },
  { src: 'scraped_data/images/company', dest: 'public/assets/img/projects' },
  { src: 'scraped_data/images/cv', dest: 'public/assets/img/projects' },
  { src: 'scraped_data/images/doc_image', dest: 'public/assets/img/projects' },
  { src: 'scraped_data/images/docs', dest: 'public/assets/img/projects' },
  { src: 'scraped_data/images/linkedin', dest: 'public/assets/img/projects' }
];

projectDirs.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.readdirSync(src).forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        fs.copyFileSync(
          path.join(src, file),
          path.join(dest, file)
        );
      }
    });
  }
});

console.log('Images copied successfully!'); 