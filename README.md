# 🐧 Penguin Formulas

A modular Google Sheets custom formula library with automatic GitHub distribution. Write formulas once, use them everywhere, and keep them automatically updated across your organization.

## ✨ Features

- **Modular Architecture**: Individual formula files for better organization
- **Automatic Distribution**: Users get updates via GitHub without manual intervention  
- **Smart Caching**: 24-hour cache with manual refresh capability
- **Zero Infrastructure**: No servers needed - just GitHub and Google Sheets
- **Fallback Support**: Works offline with last known good versions

## 🚀 Quick Start for Users

### 1. Copy the Loader Script

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Copy the entire contents of [`build/loader-template.js`](build/loader-template.js)
4. Save and run `onOpen()` once to authorize

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
   git clone https://github.com/Jython1415/penguin-formulas.git
   cd penguin-formulas
   ```

2. **Create New Formulas**:
   - Add new formula files to `src/formulas/`
   - Each file can contain multiple related functions

3. **Build and Deploy**:
   ```bash
   node scripts/build.js  # Combines all formulas into build/formulas.js
   git add .
   git commit -m "Add new CUSTOM_FORMULA function"
   git push origin main
   ```

4. **Users Get Updates**: Changes appear automatically in all sheets within 24 hours

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

### Support
- 📧 Issues: [GitHub Issues](https://github.com/Jython1415/penguin-formulas/issues)
- 📖 Documentation: This README and inline JSDoc comments
- 🔧 Debug: Use the "Debug Info" menu option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-formula`
3. Add your formula to `src/formulas/`
4. Run `node scripts/build.js` to test the build
5. Submit a pull request

## 🛣 Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and development timeline.