
function parseItems(value: any, context: string): string[] {
  if (!value) {
    throw new Error(`${context} cannot be empty`);
  }

  const stringValue = value.toString().trim();
  if (!stringValue) {
    throw new Error(`${context} cannot be empty`);
  }

  try {
    return stringValue
      .split(',')
      .map(name => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          throw new Error(`Invalid ${context}: contains empty value`);
        }
        return trimmedName;
      });
  } catch (error: any) {
    throw new Error(`${context} format error: ${error.message}`);
  }
}

export { parseItems };
