# MD Asifur Rahman's Portfolio

A modern, interactive portfolio website featuring a chatbot assistant that can answer questions about MD Asifur Rahman's professional background and experience.

## Features

- Modern, responsive design
- Interactive sections showcasing skills, projects, and experience
- AI-powered chatbot assistant
- Real-time data processing
- Smooth animations and transitions

## Tech Stack

- React.js
- Material-UI
- Framer Motion
- Transformers.js for embeddings
- OpenRouter API for chat completions
- IndexedDB for local storage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenRouter API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-agent.git
cd portfolio-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenRouter API key:
```
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Start the development server:
```bash
npm start
```

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. The build files will be created in the `build` directory.

## Deployment

### GitHub Pages

1. Add the following to your `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/portfolio-agent",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Install the gh-pages package:
```bash
npm install --save-dev gh-pages
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Other Hosting Services

The `build` directory contains the production-ready files. You can deploy these files to any static hosting service like:
- Netlify
- Vercel
- Firebase Hosting
- AWS S3
- etc.

## Project Structure

```
portfolio-agent/
├── build/                  # Production build files
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   ├── context/          # React context
│   ├── utils/            # Utility functions
│   └── App.js            # Main App component
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
