<div align="center">
  <h1>StemEdge</h1>
  <p><strong>Interactive STEM Learning Platform</strong></p>
  <p>Featuring interactive lessons, virtual labs, and exam preparation tools<br>
  designed for 98/100 institutional benchmark quality</p>
</div>

---

## Features

- **Interactive Lessons**: Engaging, inquiry-based content across Biology, Physics, Chemistry, and Math
- **Virtual Labs**: Predict-Observe-Explain methodology for deep conceptual understanding
- **Exam Preparation**: Adaptive quizzes, timed practice tests, spaced repetition
- **Multi-Level Content**: Middle School, High School, and AP/IB levels
- **Gamification**: Achievements, progress tracking, mastery badges

---

## Development Setup

### ⚠️ Important: Windows + WSL Development

This project requires **Windows native npm** when developing on the Windows filesystem (`C:\Users\...`).

#### Why?

When running `npm install` from WSL (Windows Subsystem for Linux) while the project is on the Windows filesystem (`/mnt/c/Users/...`), npm may install **Linux binaries** instead of Windows binaries. This causes errors like:

```
Error: Cannot find module 'lightningcss.win32-x64-msvc.node'
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
```

Native modules like `lightningcss`, `esbuild`, and `rollup` require platform-specific binaries that must match your actual operating system.

---

### Recommended Setup (Windows)

**Option 1: Use Windows PowerShell/CMD (Recommended)**

```powershell
# Open PowerShell or Command Prompt
cd C:\Users\bbrak\StemEdge

# Install dependencies (Windows binaries)
npm install

# Run development server
npm run dev
```

**Option 2: Use Windows Terminal with PowerShell**

```powershell
# Same commands as above
npm install
npm run dev
```

The app will be available at: `http://localhost:3000`

---

### If You Must Use WSL

**Option 1: Move project to Linux filesystem**

```bash
# Copy project to Linux home directory
cp -r /mnt/c/Users/bbrak/StemEdge ~/StemEdge
cd ~/StemEdge

# Clean and reinstall
npm run clean:full
npm install

# Run dev server
npm run dev
```

**Option 2: Force Windows platform in WSL**

```bash
# In WSL, from Windows filesystem
cd /mnt/c/Users/bbrak/StemEdge

# Clean existing modules
npm run clean:full

# Install with Windows platform flag
npm install --platform=win32

# Run dev server
npm run dev
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean:full` | Remove node_modules, package-lock.json, and dist |
| `npm run reinstall` | Clean and reinstall dependencies |
| `npm run reinstall:win` | Reinstall with Windows platform flag |

---

## Project Structure

```
StemEdge/
├── src/
│   ├── components/
│   │   ├── interactives/      # Interactive visualizations
│   │   │   ├── biology/       # Cell structure, membrane transport, etc.
│   │   │   ├── physics/       # Forces, motion, Newton's laws
│   │   │   ├── chemistry/     # Atomic structure, periodic table
│   │   │   └── math/          # Graphing, equations, expressions
│   │   ├── labs/              # Virtual lab engine
│   │   └── shared/            # Shared UI components
│   ├── data/                  # Content and configuration
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API and AI services
│   └── App.tsx                # Main application
├── public/                    # Static assets
├── index.html                 # Entry HTML
├── package.json               # Dependencies and scripts
├── .npmrc                     # NPM configuration (platform fix)
└── vite.config.ts             # Vite configuration
```

---

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Build**: Vite
- **AI Integration**: Optional backend AI proxy with safe client-side fallbacks

---

## Troubleshooting

### Error: "Cannot find module 'lightningcss.win32-x64-msvc.node'"

**Solution**: You installed dependencies from WSL on Windows filesystem.

```powershell
# From Windows PowerShell
cd C:\Users\bbrak\StemEdge
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Error: "Cannot find module '@rollup/rollup-linux-x64-gnu'"

**Solution**: Same as above - reinstall from Windows.

### Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### TypeScript errors in IDE but build works

This is often due to IDE caching. Try:
1. Restart your IDE
2. Run `npm run lint` to verify
3. Reinstall dependencies with `npm run clean:full` and `npm install`

---

## Environment Variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_AI_PROXY_URL=http://localhost:8787
```

`VITE_AI_PROXY_URL` is optional. If it is not set, AI-powered grading and tutoring fall back to deterministic local responses instead of sending provider keys from the browser.

---

## Contributing

This project follows specific coding conventions:
- No comments in code unless explicitly requested
- Follow existing code patterns and style
- Use TypeScript strict mode
- Maintain accessibility (WCAG 2.1 AA)

---

## License

MIT License

---

## Support

For issues and feature requests, please use the GitHub Issues page.

---

**Built with ❤️ for STEM education excellence.**
