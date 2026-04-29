export const createError = (code: string, message: string) => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};