delete process.env.ELECTRON_RUN_AS_NODE;
const electron = require('electron');
const { spawn } = require('child_process');

const child = spawn(electron, ['electron/main.js'], { stdio: 'inherit' });
child.on('close', (code) => process.exit(code || 0));

