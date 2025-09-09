#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const FORMULAS_DIR = path.join(__dirname, '..', 'src', 'formulas');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const OUTPUT_FILE = path.join(BUILD_DIR, 'formulas.js');

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Get current timestamp and version info
const buildTime = new Date().toISOString();
const packageInfo = (() => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    return { name: pkg.name, version: pkg.version };
  } catch (e) {
    return { name: 'penguin-formulas', version: '1.0.0' };
  }
})();

// Read all formula files
function readFormulaFiles() {
  const files = fs.readdirSync(FORMULAS_DIR)
    .filter(file => file.endsWith('.js'))
    .sort(); // Consistent ordering
  
  const formulas = [];
  
  for (const file of files) {
    const filePath = path.join(FORMULAS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    formulas.push({
      filename: file,
      content: content.trim()
    });
  }
  
  return formulas;
}

// Extract function names for directory
function extractFunctions(content) {
  const functionRegex = /function\s+([A-Z_][A-Z0-9_]*)\s*\(/g;
  const functions = [];
  let match;
  
  while ((match = functionRegex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  
  return functions;
}

// Build the combined formulas file
function buildFormulas() {
  console.log('📦 Building Penguin Formulas...');
  
  const formulas = readFormulaFiles();
  const allFunctions = [];
  
  // Header comment
  const header = `/**
 * ${packageInfo.name} v${packageInfo.version}
 * Custom Google Sheets Formulas Library
 * 
 * Built: ${buildTime}
 * GitHub: https://github.com/Jython1415/penguin-formulas
 * 
 * This file is auto-generated. Do not edit directly.
 * Edit individual files in src/formulas/ and run 'node scripts/build.js'
 */

`;

  // Collect all formula content
  const formulaContents = formulas.map(formula => {
    const functions = extractFunctions(formula.content);
    allFunctions.push(...functions);
    
    return `// ====== ${formula.filename} ======\n${formula.content}`;
  }).join('\n\n');

  // Function directory for easy reference
  const functionDirectory = `/**
 * FUNCTION DIRECTORY
 * Available custom functions in this library:
 * ${allFunctions.map(name => ` * - ${name}()`).join('\n')}
 */

`;

  // Version information function
  const versionFunction = `/**
 * Get version information about this formula library
 * @return {Array<Array>} Version information
 * @customfunction
 */
function PENGUIN_VERSION() {
  return [
    ['Library', '${packageInfo.name}'],
    ['Version', '${packageInfo.version}'],
    ['Built', '${buildTime}'],
    ['Functions', ${allFunctions.length}]
  ];
}

/**
 * List all available functions in this library
 * @return {Array<Array>} Function list
 * @customfunction
 */
function PENGUIN_FUNCTIONS() {
  const functions = [${allFunctions.map(name => `'${name}'`).join(', ')}];
  return [['Function Name']].concat(functions.map(name => [name]));
}

`;

  // Combine everything
  const output = header + functionDirectory + versionFunction + formulaContents;
  
  // Write the output file
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  
  console.log(`✅ Built ${packageInfo.name} v${packageInfo.version}`);
  console.log(`📊 Functions: ${allFunctions.length}`);
  console.log(`📁 Source files: ${formulas.length}`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`📏 Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)}KB`);
  
  return {
    success: true,
    functions: allFunctions,
    sourceFiles: formulas.length,
    outputPath: OUTPUT_FILE
  };
}

// Run the build
if (require.main === module) {
  try {
    buildFormulas();
    process.exit(0);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

module.exports = { buildFormulas };