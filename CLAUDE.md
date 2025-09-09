# Penguin Formulas - Claude Instructions

## Project Overview
This is a Google Sheets custom formula library with GitHub-based distribution. The goal is to create a modular system where:
1. Individual formula functions are maintained in separate files
2. A build system combines them into a single `formulas.js` file
3. Users can import the entire library via a simple Apps Script loader

## Architecture
```
src/formulas/           # Individual formula files
├── unpivot.js          # UNPIVOT function and variants
├── text-utils.js       # Text processing functions
└── math-utils.js       # Mathematical utility functions

build/                  # Build output
├── formulas.js         # Combined formula file for distribution
└── loader-template.js  # Apps Script loader template

scripts/                # Build and utility scripts
└── build.js            # Node.js build script
```

## Development Workflow
1. Create/modify individual formula files in `src/formulas/`
2. Run `node scripts/build.js` to generate combined `formulas.js`
3. Test in a Google Sheet using the loader template
4. Commit and push changes for automatic distribution

## Formula File Format
Each formula file should:
- Export one or more custom functions
- Include JSDoc comments with @customfunction annotation
- Handle input validation and error cases
- Be optimized for Google Sheets environment

Example:
```javascript
/**
 * Description of the function
 * @param {type} param Description
 * @return {type} Description
 * @customfunction
 */
function MY_FORMULA(param) {
  // Implementation
  return result;
}
```

## Build System Requirements
- Combine all JS files from `src/formulas/` into single output
- Preserve function names and JSDoc comments
- Add version information and build timestamp
- Generate Apps Script loader template with current repo info

## Testing Strategy
- Manual testing in Google Sheets using the loader template
- Performance benchmarking for large datasets
- Validation of function signatures and return types

## Distribution Method
Users install via copying Apps Script loader that:
- Fetches latest `formulas.js` from GitHub (via CDN)
- Caches for 24 hours for performance
- Falls back to last known good version if GitHub unavailable
- Provides manual refresh option via custom menu