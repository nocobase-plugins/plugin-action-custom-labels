/**
 * Parse function string and return executable function
 * @param functionStr - Function string to parse
 * @returns Executable function or null if parsing fails
 */
export const parseFunctionString = (functionStr: string): Function | null => {
  if (!functionStr) {
    return null;
  }

  try {
    let func;
    
    // Check if the string is a complete function declaration (contains => or function)
    if (functionStr.includes('=>') || functionStr.includes('function')) {
      // For complete function declarations, use eval (in a controlled environment)
      // This allows users to write: (repo, filter) => { return {...} }
      func = eval(`(${functionStr})`);
    } else {
      // For function body only, use new Function
      // This allows users to write: "return {...}"
      func = new Function('repo', 'filter', functionStr);
    }
    
    return func;
  } catch (error) {
    console.error('Failed to parse function string:', error);
    return null;
  }
};
