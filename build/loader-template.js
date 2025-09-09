/**
 * PENGUIN FORMULAS LOADER - Google Apps Script Template
 * 
 * Copy this entire script into your Google Apps Script project to automatically
 * load the latest Penguin Formulas library from GitHub.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Replace YOUR_GITHUB_USERNAME with your actual GitHub username
 * 2. Replace YOUR_REPO_NAME with your repository name (default: penguin-formulas)
 * 3. Save and run the onOpen function once to trigger authorization
 * 4. The formulas will load automatically when the spreadsheet opens
 * 
 * CONFIGURATION: Update these values with your GitHub details
 */
const CONFIG = {
  owner: 'Jython1415',                  // GitHub username
  repo: 'penguin-formulas',             // Repository name  
  path: 'build/formulas.js',            // Path to the built formula file
  branch: 'main',                       // Branch to use (main for stable)
  cacheHours: 24                        // How long to cache (24 hours recommended)
};

/**
 * Initialize custom formulas on spreadsheet open
 * This runs automatically when the spreadsheet opens
 */
function onOpen() {
  loadPenguinFormulas();
  
  // Add a custom menu for manual operations
  SpreadsheetApp.getUi()
    .createMenu('🐧 Penguin Formulas')
    .addItem('🔄 Update Formulas', 'forceUpdateFormulas')
    .addItem('📋 List Functions', 'showAvailableFunctions')
    .addItem('ℹ️ Version Info', 'showVersionInfo')
    .addItem('🔧 Debug Info', 'showDebugInfo')
    .addToUi();
}

/**
 * Load Penguin Formulas from GitHub with intelligent caching
 */
function loadPenguinFormulas() {
  const cache = CacheService.getScriptCache();
  const cacheKey = \`penguin_formulas_\${CONFIG.owner}_\${CONFIG.repo}_\${CONFIG.path}\`;
  
  try {
    // Check cache first
    let code = cache.get(cacheKey);
    let source = 'cache';
    
    if (!code) {
      // Fetch from GitHub if not cached
      console.log('🌐 Loading Penguin Formulas from GitHub...');
      const fetchResult = fetchFromGitHub();
      code = fetchResult.code;
      source = fetchResult.source;
      
      if (code) {
        // Cache for specified hours (convert to seconds)
        cache.put(cacheKey, code, CONFIG.cacheHours * 3600);
        console.log('✅ Formulas loaded and cached successfully');
      }
    } else {
      console.log('💾 Using cached Penguin Formulas');
    }
    
    // Execute the formula code
    if (code) {
      eval(code);
      console.log('🐧 Penguin Formulas ready to use!');
      
      // Store metadata about the loaded version
      const properties = PropertiesService.getScriptProperties();
      properties.setProperty('lastFormulaUpdate', new Date().toISOString());
      properties.setProperty('lastFormulaSource', source);
      
      // Try to get version info from the loaded functions
      try {
        const versionInfo = PENGUIN_VERSION();
        const version = versionInfo.find(row => row[0] === 'Version')?.[1] || 'unknown';
        const functionCount = versionInfo.find(row => row[0] === 'Functions')?.[1] || 'unknown';
        properties.setProperty('loadedVersion', version);
        properties.setProperty('functionCount', functionCount.toString());
        console.log(\`📊 Loaded v\${version} with \${functionCount} functions\`);
      } catch (e) {
        console.warn('Could not extract version information:', e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to load Penguin Formulas:', error);
    
    // Try to use last known good version from properties
    loadFallbackFormulas();
  }
}

/**
 * Fetch the latest code from GitHub with multiple fallback sources
 */
function fetchFromGitHub() {
  const urls = [
    // Try CDN first (faster, better caching, more reliable)
    \`https://cdn.jsdelivr.net/gh/\${CONFIG.owner}/\${CONFIG.repo}@\${CONFIG.branch}/\${CONFIG.path}\`,
    // Fallback to raw GitHub
    \`https://raw.githubusercontent.com/\${CONFIG.owner}/\${CONFIG.repo}/\${CONFIG.branch}/\${CONFIG.path}\`
  ];
  
  for (const url of urls) {
    try {
      console.log(\`🔍 Trying: \${url}\`);
      const response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'GoogleAppsScript-PenguinFormulas/1.0'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const code = response.getContentText();
        
        // Basic validation - ensure it looks like our formula file
        if (code.includes('penguin-formulas') || code.includes('UNPIVOT') || code.includes('PENGUIN_VERSION')) {
          // Save as fallback for future failures
          PropertiesService.getScriptProperties()
            .setProperty('lastGoodFormulas', code);
          
          const source = url.includes('cdn.jsdelivr.net') ? 'cdn' : 'github-raw';
          return { code, source };
        } else {
          console.warn(\`Invalid formula file content from \${url}\`);
        }
      } else {
        console.warn(\`HTTP \${response.getResponseCode()} from \${url}\`);
      }
    } catch (error) {
      console.warn(\`Failed to fetch from \${url}:\`, error.message);
    }
  }
  
  throw new Error('Could not fetch formulas from any source');
}

/**
 * Load fallback formulas if GitHub is unavailable
 */
function loadFallbackFormulas() {
  const fallback = PropertiesService.getScriptProperties()
    .getProperty('lastGoodFormulas');
  
  if (fallback) {
    eval(fallback);
    console.warn('⚠️ Using fallback formulas (may not be latest version)');
    
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '⚠️ Using cached formulas. Network issues detected. Select Penguin Formulas → Update Formulas to retry.',
      'Formula Status',
      8
    );
  } else {
    console.error('❌ No fallback formulas available');
    
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '❌ Penguin Formulas unavailable. Check your network connection or contact the administrator.',
      'Formula Error',
      -1  // Sticky notification
    );
  }
}

/**
 * Force update formulas (clears cache and reloads)
 */
function forceUpdateFormulas() {
  const cache = CacheService.getScriptCache();
  const cacheKey = \`penguin_formulas_\${CONFIG.owner}_\${CONFIG.repo}_\${CONFIG.path}\`;
  
  try {
    // Clear cache
    cache.remove(cacheKey);
    console.log('🗑️ Cache cleared');
    
    // Show loading message
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '🔄 Updating formulas from GitHub...',
      'Update in Progress',
      3
    );
    
    // Reload
    loadPenguinFormulas();
    
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '✅ Penguin Formulas updated successfully!',
      'Update Complete',
      5
    );
    
  } catch (error) {
    console.error('Update failed:', error);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '❌ Update failed: ' + error.message,
      'Update Error',
      8
    );
  }
}

/**
 * Show available functions in a dialog
 */
function showAvailableFunctions() {
  try {
    const functions = PENGUIN_FUNCTIONS();
    const functionList = functions.slice(1).map(row => row[0]).join('\\n• ');
    const message = \`Available Penguin Formula functions:\\n\\n• \${functionList}\`;
    
    SpreadsheetApp.getUi().alert(
      'Available Functions', 
      message, 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Error', 
      'Could not retrieve function list. Make sure formulas are loaded properly.', 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Show version information in a dialog
 */
function showVersionInfo() {
  try {
    const versionInfo = PENGUIN_VERSION();
    const versionText = versionInfo.map(row => \`\${row[0]}: \${row[1]}\`).join('\\n');
    
    const properties = PropertiesService.getScriptProperties();
    const lastUpdate = properties.getProperty('lastFormulaUpdate');
    const source = properties.getProperty('lastFormulaSource') || 'unknown';
    
    const message = \`\${versionText}\\n\\nLast Updated: \${lastUpdate ? new Date(lastUpdate).toLocaleString() : 'unknown'}\\nSource: \${source}\`;
    
    SpreadsheetApp.getUi().alert(
      'Penguin Formulas Version', 
      message, 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Error', 
      'Could not retrieve version information. Make sure formulas are loaded properly.', 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Show debug information for troubleshooting
 */
function showDebugInfo() {
  const properties = PropertiesService.getScriptProperties();
  const config = \`Owner: \${CONFIG.owner}\\nRepo: \${CONFIG.repo}\\nPath: \${CONFIG.path}\\nBranch: \${CONFIG.branch}\\nCache Hours: \${CONFIG.cacheHours}\`;
  
  const urls = [
    \`https://cdn.jsdelivr.net/gh/\${CONFIG.owner}/\${CONFIG.repo}@\${CONFIG.branch}/\${CONFIG.path}\`,
    \`https://raw.githubusercontent.com/\${CONFIG.owner}/\${CONFIG.repo}/\${CONFIG.branch}/\${CONFIG.path}\`
  ];
  
  const debugInfo = \`Configuration:\\n\${config}\\n\\nSource URLs:\\n• \${urls.join('\\n• ')}\\n\\nLast Update: \${properties.getProperty('lastFormulaUpdate') || 'never'}\\nLoaded Version: \${properties.getProperty('loadedVersion') || 'unknown'}\\nFunction Count: \${properties.getProperty('functionCount') || 'unknown'}\`;
  
  SpreadsheetApp.getUi().alert(
    'Debug Information',
    debugInfo,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// Auto-initialize on script load
loadPenguinFormulas();