# 🐧 Penguin Formulas

A modular Google Sheets custom formula library with automatic GitHub distribution. Write formulas once, use them everywhere, and keep them automatically updated across your organization.

## ✨ Features

- **Modular Architecture**: Individual formula files for better organization
- **Automatic Distribution**: Users get updates via GitHub without manual intervention  
- **Smart Caching**: 24-hour cache with manual refresh capability
- **Performance Optimized**: Functions built for speed with large datasets
- **Zero Infrastructure**: No servers needed - just GitHub and Google Sheets
- **Fallback Support**: Works offline with last known good versions

## 🚀 Quick Start for Users

### 1. Copy the Loader Script

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Copy the entire contents of [`build/loader-template.js`](build/loader-template.js)
4. Replace `YOUR_GITHUB_USERNAME` with the actual username
5. Save and run `onOpen()` once to authorize

### 2. Start Using Formulas

All formulas are immediately available:
- `=UNPIVOT(A1:E10)` - Transform wide data to long format
- `=UNPIVOT_ULTRA(A1:E10)` - High-performance version for large datasets
- `=BENCHMARK_UNPIVOT(A1:E10)` - Performance comparison
- `=PENGUIN_VERSION()` - Get library version info
- `=PENGUIN_FUNCTIONS()` - List all available functions

### 3. Manage Updates

- **Automatic**: Updates happen every 24 hours
- **Manual**: Use the "🐧 Penguin Formulas" menu → "Update Formulas"
- **Status**: Check version info and debug details via the menu

## 🛠 Development Setup

### For Library Maintainers

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/penguin-formulas.git
   cd penguin-formulas
   npm install  # Optional, just for package.json metadata
   ```

2. **Create New Formulas**:
   ```bash
   # Add new formula files to src/formulas/
   # Each file can contain multiple related functions
   ```

3. **Build and Deploy**:
   ```bash
   node scripts/build.js  # Combines all formulas into build/formulas.js
   git add .
   git commit -m "Add new CUSTOM_FORMULA function"
   git push origin main
   ```

4. **Users Get Updates**: Changes appear automatically in all sheets within 24 hours

### Project Structure
```
penguin-formulas/
├── src/formulas/           # Individual formula files
│   ├── unpivot.js         # Data transformation functions
│   ├── text-utils.js      # Text processing (future)
│   └── math-utils.js      # Math utilities (future)
├── build/                 # Generated files
│   ├── formulas.js        # Combined formula library
│   └── loader-template.js # Apps Script loader
├── scripts/
│   └── build.js          # Build system
├── docs/                 # Documentation
├── CLAUDE.md            # Development instructions
└── ROADMAP.md           # Development roadmap
```

## 📊 Available Functions

### Data Transformation

#### `UNPIVOT(data, fixedCols, fixedRows, attributeCol, valueCol, emptyValue)`
Transform wide data format to long format (pivot table reverse).

**Parameters**:
- `data`: Range of data to transform
- `fixedCols`: Number of columns to keep fixed (default: 1)
- `fixedRows`: Number of header rows (default: 1) 
- `attributeCol`: Name for attribute column (default: "Attribute")
- `valueCol`: Name for value column (default: "Value")
- `emptyValue`: How to handle empty cells (default: false = skip)

**Example**:
```javascript
// Transform this data:
// Name    Jan  Feb  Mar
// Alice   100  200  150
// Bob     50   75   125

=UNPIVOT(A1:D3, 1, 1, "Month", "Sales")

// Results in:
// Name   Month  Sales
// Alice  Jan    100
// Alice  Feb    200  
// Alice  Mar    150
// Bob    Jan    50
// Bob    Feb    75
// Bob    Mar    125
```

#### `UNPIVOT_ULTRA(...)` 
High-performance version optimized for large datasets (1000+ rows).

#### `BENCHMARK_UNPIVOT(data, iterations, emptyValue)`
Compare performance of different UNPIVOT implementations.

### Utility Functions

#### `PENGUIN_VERSION()`
Returns version information about the loaded library.

#### `PENGUIN_FUNCTIONS()`  
Lists all available functions in the library.

## 🔧 Configuration Options

### Loader Script Configuration
```javascript
const CONFIG = {
  owner: 'YOUR_USERNAME',     // GitHub username
  repo: 'penguin-formulas',   // Repository name
  path: 'build/formulas.js',  // Path to formula file  
  branch: 'main',             // Git branch (use 'dev' for testing)
  cacheHours: 24              // Cache duration
};
```

### Empty Value Handling
```javascript
// Skip empty cells (default)
=UNPIVOT(A1:D10, 1, 1, "Attr", "Value", false)

// Include empty cells as blank strings  
=UNPIVOT(A1:D10, 1, 1, "Attr", "Value", true)

// Replace empty cells with specific value
=UNPIVOT(A1:D10, 1, 1, "Attr", "Value", "N/A")
```

## 🎯 Performance

The UNPIVOT functions are optimized for Google Sheets:
- **Memory efficient**: Pre-allocated arrays prevent resizing
- **Speed optimized**: Batch operations and reduced function calls
- **Large dataset support**: Handles 10,000+ rows efficiently
- **Smart caching**: Reduces repeated calculations

Benchmark with your data using `=BENCHMARK_UNPIVOT(range)`.

## 🔄 Update Strategy

### For Users
- **Set and forget**: Formulas update automatically every 24 hours
- **Force update**: Use the menu when you need immediate updates
- **Offline support**: Falls back to cached version if GitHub is unavailable

### For Developers  
- **Non-breaking changes**: Push directly to main branch
- **Breaking changes**: Use feature branches and communicate with users
- **Testing**: Use `branch: 'dev'` in CONFIG for testing new features

## 📝 Best Practices

### Formula Development
1. **One file per category**: Group related functions together
2. **JSDoc everything**: Include `@customfunction` and parameter docs
3. **Input validation**: Check parameters and provide clear error messages
4. **Performance first**: Optimize for Google Sheets environment

### Version Management
1. **Semantic versioning**: Major.Minor.Patch in package.json
2. **Clear commit messages**: Describe what functions were added/changed
3. **Test before push**: Always verify in a test sheet first
4. **Communicate breaking changes**: Email users about major updates

## 🆘 Troubleshooting

### Common Issues

**Formulas not loading**:
1. Check network connection
2. Use "🐧 Penguin Formulas" menu → "Update Formulas"
3. Verify GitHub username/repo in CONFIG
4. Check "Debug Info" for configuration details

**Function not found**: 
1. Ensure formula name is spelled correctly (case sensitive)
2. Check if function exists with "List Functions" menu
3. Try force updating formulas

**Performance issues**:
1. Use `UNPIVOT_ULTRA` for large datasets (1000+ rows)
2. Consider chunking very large operations
3. Run `BENCHMARK_UNPIVOT` to compare performance

### Support
- 📧 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/penguin-formulas/issues)
- 📖 Documentation: This README and inline JSDoc comments
- 🔧 Debug: Use the "Debug Info" menu option

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-formula`
3. Add your formula to `src/formulas/`
4. Run `node scripts/build.js` to test the build
5. Submit a pull request

## 🛣 Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and development timeline.

---

**Made with ❤️ for Google Sheets power users**