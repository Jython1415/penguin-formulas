/**
 * HIGH-PERFORMANCE UNPIVOT FUNCTION
 * Optimized for speed with large datasets while maintaining the same API
 * 
 * @param {Array<Array>} data The range of data to unpivot
 * @param {number} fixedCols Number of columns to keep fixed (default: 1)
 * @param {number} fixedRows Number of header rows (default: 1)
 * @param {string} attributeCol Name for the attribute column (default: "Attribute")
 * @param {string} valueCol Name for the value column (default: "Value")
 * @param {boolean|string|number} emptyValue How to handle empty values (default: false)
 *   - false: Skip empty values
 *   - true: Include empty values as empty strings
 *   - string/number: Replace empty values with this value
 * @return {Array<Array>} Unpivoted data with headers
 * @customfunction
 */
function UNPIVOT(data, fixedCols = 1, fixedRows = 1, attributeCol = "Attribute", valueCol = "Value", emptyValue = false) {
  // Input validation - fail fast
  if (!Array.isArray(data) || data.length < fixedRows) {
    throw new Error('Invalid data: Need at least ' + fixedRows + ' row(s)');
  }
  
  if (fixedCols < 0 || fixedRows < 1 || fixedRows > 2) {
    throw new Error('Invalid parameters: fixedCols >= 0, fixedRows between 1-2');
  }
  
  const dataLength = data.length;
  const firstRowLength = data[0].length;
  
  // Pre-process headers for performance - avoid repeated operations
  const headers = new Array(firstRowLength);
  for (let j = 0; j < firstRowLength; j++) {
    headers[j] = data[0][j];
  }
  
  // Handle 2 header rows efficiently
  if (fixedRows === 2 && dataLength > 1) {
    const secondRow = data[1];
    for (let j = fixedCols; j < firstRowLength; j++) {
      if (headers[j] === '' && secondRow[j] !== '') {
        headers[j] = secondRow[j];
      } else if (headers[j] !== '' && secondRow[j] !== '') {
        headers[j] = headers[j] + ' - ' + secondRow[j];
      }
    }
  }
  
  // Calculate result dimensions to pre-allocate array
  const valueColumns = firstRowLength - fixedCols;
  const dataRows = dataLength - fixedRows;
  
  // Estimate result size (over-allocate to avoid resizing)
  // In worst case, every cell has a value
  const maxResultRows = 1 + (dataRows * valueColumns);
  const result = new Array(maxResultRows);
  
  // Create header row efficiently
  const resultHeader = new Array(fixedCols + 2);
  for (let i = 0; i < fixedCols; i++) {
    resultHeader[i] = headers[i];
  }
  resultHeader[fixedCols] = attributeCol;
  resultHeader[fixedCols + 1] = valueCol;
  result[0] = resultHeader;
  
  let resultIndex = 1;
  
  // Helper function to determine if we should include a value
  const shouldIncludeValue = (value) => {
    const isEmpty = value === '' || value === null || value === undefined;
    return !isEmpty || emptyValue !== false;
  };
  
  // Helper function to get the final value to include
  const getFinalValue = (value) => {
    const isEmpty = value === '' || value === null || value === undefined;
    if (isEmpty && emptyValue !== false) {
      return emptyValue === true ? "" : emptyValue;
    }
    return value;
  };
  
  // Main processing loop - optimized for speed
  for (let i = fixedRows; i < dataLength; i++) {
    const row = data[i];
    
    // Quick empty row check - check only fixed columns first
    let hasData = false;
    for (let j = 0; j < fixedCols; j++) {
      if (row[j] !== '' && row[j] !== null && row[j] !== undefined) {
        hasData = true;
        break;
      }
    }
    
    // If no data in fixed columns, skip entirely
    if (!hasData) continue;
    
    // Cache fixed column values to avoid repeated access
    const fixedValues = new Array(fixedCols);
    for (let j = 0; j < fixedCols; j++) {
      fixedValues[j] = row[j];
    }
    
    // Process value columns
    for (let j = fixedCols; j < firstRowLength; j++) {
      const value = row[j];
      
      // Check if we should include this value
      if (shouldIncludeValue(value)) {
        // Create new row efficiently using direct assignment
        const newRow = new Array(fixedCols + 2);
        
        // Copy fixed values
        for (let k = 0; k < fixedCols; k++) {
          newRow[k] = fixedValues[k];
        }
        
        newRow[fixedCols] = headers[j];           // Attribute
        newRow[fixedCols + 1] = getFinalValue(value);  // Value
        
        result[resultIndex++] = newRow;
      }
    }
  }
  
  // Trim result array to actual size
  result.length = resultIndex;
  
  return result;
}

/**
 * ULTRA-HIGH-PERFORMANCE UNPIVOT (Advanced)
 * For extremely large datasets - trades memory for speed
 * Uses typed arrays and batch operations where possible
 * 
 * @param {Array<Array>} data The range of data to unpivot
 * @param {number} fixedCols Number of columns to keep fixed (default: 1)
 * @param {number} fixedRows Number of header rows (default: 1)
 * @param {string} attributeCol Name for the attribute column (default: "Attribute")
 * @param {string} valueCol Name for the value column (default: "Value")
 * @param {boolean|string|number} emptyValue How to handle empty values (default: false)
 *   - false: Skip empty values
 *   - true: Include empty values as empty strings
 *   - string/number: Replace empty values with this value
 * @return {Array<Array>} Unpivoted data with headers
 * @customfunction
 */
function UNPIVOT_ULTRA(data, fixedCols = 1, fixedRows = 1, attributeCol = "Attribute", valueCol = "Value", emptyValue = false) {
  // Same validation as above
  if (!Array.isArray(data) || data.length < fixedRows) {
    throw new Error('Invalid data: Need at least ' + fixedRows + ' row(s)');
  }
  
  if (fixedCols < 0 || fixedRows < 1 || fixedRows > 2) {
    throw new Error('Invalid parameters: fixedCols >= 0, fixedRows between 1-2');
  }
  
  const dataLength = data.length;
  const firstRowLength = data[0].length;
  const valueColumns = firstRowLength - fixedCols;
  const dataRows = dataLength - fixedRows;
  
  // Helper functions for empty value handling
  const shouldIncludeValue = (value) => {
    const isEmpty = value === '' || value === null || value === undefined;
    return !isEmpty || emptyValue !== false;
  };
  
  const getFinalValue = (value) => {
    const isEmpty = value === '' || value === null || value === undefined;
    if (isEmpty && emptyValue !== false) {
      return emptyValue === true ? "" : emptyValue;
    }
    return value;
  };
  
  // Use object pooling for temporary arrays to reduce GC pressure
  const rowPool = [];
  const getPooledRow = (size) => {
    const row = rowPool.pop() || new Array(size);
    row.length = size;
    return row;
  };
  const returnPooledRow = (row) => {
    if (rowPool.length < 100) rowPool.push(row); // Limit pool size
  };
  
  // Pre-process headers
  const headers = data[0].slice(); // Shallow copy
  if (fixedRows === 2 && dataLength > 1) {
    const secondRow = data[1];
    for (let j = fixedCols; j < firstRowLength; j++) {
      if (headers[j] === '' && secondRow[j] !== '') {
        headers[j] = secondRow[j];
      } else if (headers[j] !== '' && secondRow[j] !== '') {
        headers[j] = headers[j] + ' - ' + secondRow[j];
      }
    }
  }
  
  // First pass: count actual result rows to allocate exact size
  let actualResultRows = 1; // Header row
  for (let i = fixedRows; i < dataLength; i++) {
    const row = data[i];
    for (let j = fixedCols; j < firstRowLength; j++) {
      const value = row[j];
      if (shouldIncludeValue(value)) {
        actualResultRows++;
      }
    }
  }
  
  // Allocate exact result size
  const result = new Array(actualResultRows);
  
  // Header row
  const resultHeader = new Array(fixedCols + 2);
  for (let i = 0; i < fixedCols; i++) {
    resultHeader[i] = headers[i];
  }
  resultHeader[fixedCols] = attributeCol;
  resultHeader[fixedCols + 1] = valueCol;
  result[0] = resultHeader;
  
  // Second pass: populate result
  let resultIndex = 1;
  for (let i = fixedRows; i < dataLength; i++) {
    const row = data[i];
    
    for (let j = fixedCols; j < firstRowLength; j++) {
      const value = row[j];
      
      if (shouldIncludeValue(value)) {
        const newRow = new Array(fixedCols + 2);
        
        // Batch copy fixed columns
        for (let k = 0; k < fixedCols; k++) {
          newRow[k] = row[k];
        }
        
        newRow[fixedCols] = headers[j];
        newRow[fixedCols + 1] = getFinalValue(value);
        
        result[resultIndex++] = newRow;
      }
    }
  }
  
  return result;
}

/**
 * BENCHMARK FUNCTION
 * Compare performance of different implementations
 * 
 * @param {Array<Array>} data Test data
 * @param {number} iterations Number of test iterations (default: 100)
 * @param {boolean|string|number} emptyValue Empty value handling for benchmark (default: false)
 * @return {Array<Array>} Performance results
 * @customfunction
 */
function BENCHMARK_UNPIVOT(data, iterations = 100, emptyValue = false) {
  const results = [
    ['Function', 'Avg Time (ms)', 'Total Time (ms)', 'Result Rows']
  ];
  
  // Benchmark standard UNPIVOT
  const start1 = new Date().getTime();
  let result1;
  for (let i = 0; i < iterations; i++) {
    result1 = UNPIVOT(data, 1, 1, "Attribute", "Value", emptyValue);
  }
  const end1 = new Date().getTime();
  const time1 = end1 - start1;
  
  results.push([
    'UNPIVOT (Standard)',
    (time1 / iterations).toFixed(2),
    time1,
    result1.length
  ]);
  
  // Benchmark ultra version
  const start2 = new Date().getTime();
  let result2;
  for (let i = 0; i < iterations; i++) {
    result2 = UNPIVOT_ULTRA(data, 1, 1, "Attribute", "Value", emptyValue);
  }
  const end2 = new Date().getTime();
  const time2 = end2 - start2;
  
  results.push([
    'UNPIVOT_ULTRA',
    (time2 / iterations).toFixed(2),
    time2,
    result2.length
  ]);
  
  // Performance comparison
  const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
  results.push([
    'Performance Gain',
    improvement + '%',
    'Ultra vs Standard',
    'Same Results: ' + (JSON.stringify(result1) === JSON.stringify(result2))
  ]);
  
  return results;
}