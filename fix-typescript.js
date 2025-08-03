import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 TypeScript Module Resolution Fix Script');
console.log('==========================================');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

console.log('✅ Found package.json');

// Check TypeScript configuration
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  console.error('❌ Error: tsconfig.json not found.');
  process.exit(1);
}

console.log('✅ Found tsconfig.json');

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ Error: node_modules not found. Please run "npm install" first.');
  process.exit(1);
}

console.log('✅ Found node_modules');

// Check critical dependencies
const criticalDeps = [
  'react',
  '@types/react',
  '@types/react-dom',
  'typescript',
  'sonner',
  'lucide-react',
  'react-router-dom',
  'react-chartjs-2',
  'chart.js'
];

console.log('\n📦 Checking critical dependencies...');
let missingDeps = [];

criticalDeps.forEach(dep => {
  const depPath = path.join(nodeModulesPath, dep);
  if (fs.existsSync(depPath)) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    missingDeps.push(dep);
  }
});

// Check UI components
console.log('\n🎨 Checking UI components...');
const uiComponentsPath = path.join(process.cwd(), 'src', 'components', 'ui');
if (fs.existsSync(uiComponentsPath)) {
  console.log('✅ UI components directory exists');
  
  const criticalUIComponents = [
    'button.tsx',
    'card.tsx',
    'badge.tsx',
    'input.tsx',
    'select.tsx',
    'progress.tsx',
    'tabs.tsx',
    'textarea.tsx'
  ];
  
  criticalUIComponents.forEach(component => {
    const componentPath = path.join(uiComponentsPath, component);
    if (fs.existsSync(componentPath)) {
      console.log(`✅ ${component}`);
    } else {
      console.log(`❌ ${component} - MISSING`);
    }
  });
} else {
  console.log('❌ UI components directory not found');
}

// Provide recommendations
console.log('\n💡 Recommendations:');

if (missingDeps.length > 0) {
  console.log('1. Install missing dependencies:');
  console.log(`   npm install ${missingDeps.join(' ')}`);
}

console.log('2. Clear TypeScript cache:');
console.log('   - In VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"');
console.log('   - Or restart your IDE completely');

console.log('3. Clear node_modules and reinstall:');
console.log('   rm -rf node_modules package-lock.json');
console.log('   npm install');

console.log('4. Check your IDE TypeScript version:');
console.log('   - Make sure you\'re using the workspace TypeScript version');
console.log('   - In VS Code: Ctrl+Shift+P → "TypeScript: Select TypeScript Version"');

console.log('\n🎯 Quick Fix Commands:');
console.log('npm run build  # Test if the build works');
console.log('npm run dev    # Start development server');

console.log('\n✨ Script completed!');