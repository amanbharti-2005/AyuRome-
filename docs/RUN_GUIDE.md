# Local Run Guide

## Prerequisites
- Node.js (LTS recommended)
- npm (installed with Node.js)
- VS Code or another code editor

## Windows PowerShell

Open the folder that contains `package.json`, then run:

```powershell
npm install
npm run dev
```

If npm reports that it cannot find `package.json`, the terminal is in the wrong directory. Run `dir` and confirm that `package.json`, `index.html`, `src`, and `public` are visible. Use `cd "FULL_PATH_TO_ayurome-full-project"` to enter the correct folder.

## Production build

```bash
npm run build
npm run preview
```

## Common issues
- **ENOENT package.json:** move to the project root, not the `src` folder or parent folder.
- **EPERM / access denied:** close processes locking the folder, reopen VS Code, and ensure the project is in a user-writable directory.
- **Missing image:** check that the exact filename exists under `public/images`. Vite serves these assets from `/images/<filename>`.
