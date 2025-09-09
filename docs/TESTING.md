# Testing Guide for Penguin Formulas

## Quick Manual Testing Setup

### 1. Prepare Test Environment
1. Create a new Google Sheet for testing
2. Go to **Extensions** → **Apps Script**
3. Copy the loader template from `build/loader-template.js`
4. Update CONFIG section:
   ```javascript
   const CONFIG = {
     owner: 'YOUR_GITHUB_USERNAME',
     repo: 'penguin-formulas',
     path: 'build/formulas.js',
     branch: 'main',  // or 'dev' for testing
     cacheHours: 0    // Disable cache during testing
   };
   ```

### 2. Test Formula Loading
1. Save and run the `onOpen()` function
2. Check the execution log for success messages
3. Verify the "🐧 Penguin Formulas" menu appears
4. Test "Version Info" to confirm loading worked

### 3. Test Core Functions

#### UNPIVOT Testing
Create test data in your sheet:

```
A1:D4:
Name     Jan  Feb  Mar
Alice    100  200  150  
Bob      50   75   125
Charlie  200  180  220
```

Test formulas:
- `=UNPIVOT(A1:D4)` - Basic unpivot
- `=UNPIVOT(A1:D4, 1, 1, "Month", "Sales")` - Custom column names
- `=UNPIVOT(A1:D4, 1, 1, "Month", "Sales", true)` - Include empty values
- `=UNPIVOT_ULTRA(A1:D4)` - High-performance version

#### Version Functions
- `=PENGUIN_VERSION()` - Should show version info
- `=PENGUIN_FUNCTIONS()` - Should list all available functions

#### Performance Testing
For large dataset testing:
1. Create test data with 100+ rows and 10+ columns
2. Use `=BENCHMARK_UNPIVOT(range, 10)` to compare performance
3. Verify both UNPIVOT and UNPIVOT_ULTRA produce same results

### 4. Test Update Mechanism
1. Make a small change to a formula in `src/formulas/`
2. Run `node scripts/build.js` to rebuild
3. In Google Sheets, use "🐧 Penguin Formulas" → "Update Formulas"
4. Verify the change is reflected (check version or function behavior)

### 5. Test Error Handling
Try these to verify proper error handling:
- `=UNPIVOT([])` - Empty array
- `=UNPIVOT(A1:A1)` - Too few rows
- `=UNPIVOT(A1:B5, -1)` - Invalid fixedCols
- `=UNPIVOT(A1:B5, 1, 3)` - Invalid fixedRows

## Testing Checklist

### Basic Functionality
- [ ] Loader script loads without errors
- [ ] Custom menu appears in Google Sheets
- [ ] UNPIVOT works with simple data
- [ ] UNPIVOT_ULTRA produces same results as UNPIVOT
- [ ] PENGUIN_VERSION returns valid version info
- [ ] PENGUIN_FUNCTIONS lists expected functions

### Advanced Features
- [ ] Two-header-row support works correctly
- [ ] Empty value handling works (false, true, custom values)
- [ ] Large dataset performance is acceptable
- [ ] Error messages are clear and helpful

### Update System
- [ ] Manual formula update works via menu
- [ ] Version information updates after refresh
- [ ] Cache clearing works properly
- [ ] Fallback to cached version when GitHub unavailable

### Configuration Testing
- [ ] Different branch settings work (main vs dev)
- [ ] CDN vs GitHub raw URL fallback works
- [ ] Cache duration settings are respected
- [ ] Debug info shows correct configuration

## Performance Benchmarks

Expected performance on typical hardware:

| Dataset Size | UNPIVOT Time | UNPIVOT_ULTRA Time | Notes |
|--------------|--------------|-------------------|--------|
| 10x10        | < 50ms       | < 30ms            | Small data |
| 100x10       | < 200ms      | < 100ms           | Medium data |
| 1000x10      | < 2s         | < 1s              | Large data |
| 5000x20      | < 10s        | < 5s              | Very large |

If performance is significantly worse, investigate:
1. Google Sheets execution environment changes
2. Formula optimization opportunities
3. Memory allocation issues

## Troubleshooting Common Issues

### "Function not found" errors
- Check spelling and capitalization
- Verify formulas loaded successfully
- Try updating formulas manually

### Performance issues
- Use UNPIVOT_ULTRA for large datasets
- Check if data contains many empty cells
- Consider chunking very large operations

### Loading failures
- Check network connectivity
- Verify GitHub username/repo are correct
- Check if repository is public
- Review execution logs for specific errors

### Cache issues
- Set `cacheHours: 0` during development
- Use "Update Formulas" to clear cache
- Check PropertiesService storage limits

## Development Testing Workflow

1. **Before committing**:
   - Run `node scripts/build.js` 
   - Test build output in Google Sheets
   - Verify no regressions in existing functions

2. **For new functions**:
   - Add comprehensive JSDoc documentation
   - Test with various input types
   - Include error handling test cases
   - Update README with examples

3. **Performance testing**:
   - Use BENCHMARK_UNPIVOT for comparison
   - Test with realistic data sizes
   - Monitor memory usage in large operations

4. **Cross-browser testing**:
   - Test in different Google Sheets environments
   - Verify mobile compatibility if relevant
   - Check Apps Script execution limits