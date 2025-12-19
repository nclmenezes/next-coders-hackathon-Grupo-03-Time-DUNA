# Hackathon Communication App

A simplified communication/email application for the Next Coders Hackathon. This app allows you to select recipients and send mock emails.

## Features

- 📧 Email list with filtering by name, class, and role
- ✅ Multiple recipient selection
- 📝 Email composition interface
- 🎯 Mock API calls (no real emails sent)
- 📱 Responsive Material-UI design

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI
- React Router
- React Toastify

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Running the App

\`\`\`bash
npm run dev
\`\`\`

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── CommunicationList.tsx      # Email list with filters
│   ├── CommunicationSender.tsx    # Email composition
│   └── Loading.tsx                # Loading spinner
├── services/           # API services
│   ├── mailService.ts             # Mock email service
│   └── mockData.ts                # Mock data
├── types/             # TypeScript types
│   └── index.ts
├── utils/             # Utilities
│   └── toast.ts                   # Toast notifications
├── App.tsx            # Main app component
└── main.tsx          # App entry point
\`\`\`

## How It Works

1. **Communication List**: Browse and filter a list of email recipients
2. **Select Recipients**: Check the emails you want to send to
3. **Compose Message**: Write your email message
4. **Send**: Click send to simulate sending the email (mocked)

All API calls are mocked and simulated with delays to mimic real API behavior.

## Mock Data

The app includes 10 mock users with different roles (Aluno, Instrutor, Coordenador) and classes (Turma A, B, C).

## License

MIT
