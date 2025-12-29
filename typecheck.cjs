const { execSync } = require('child_process');

try {
  execSync('tsc --noEmit --strict false --skipLibCheck --moduleResolution node16 --types vitepress/client,vue docs/.vitepress/theme/index.ts', {
    stdio: 'inherit'
  });
  console.log('TypeScript type check passed!');
} catch (error) {
  const stdout = error.stdout || '';
  const stderr = error.stderr || '';  
  
  console.error('TypeScript type check failed:');
  console.error('Exit code:', error.status);
  if (stdout) console.error('STDOUT:', stdout);
  if (stderr) console.error('STDERR:', stderr);
  
  process.exit(1);
}
