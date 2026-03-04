import { execSync } from 'child_process';

const hasDeployment = Boolean(process.env.CONVEX_DEPLOYMENT || process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_DEPLOY_KEY);
if (!hasDeployment) {
  console.log('Skipping convex codegen: no CONVEX_DEPLOYMENT / NEXT_PUBLIC_CONVEX_URL / CONVEX_DEPLOY_KEY set');
  process.exit(0);
}

try {
  console.log('Running convex codegen...');
  execSync('npx convex codegen', { stdio: 'inherit' });
} catch (err) {
  console.error('convex codegen failed:', err.message || err);
  process.exit(1);
}
