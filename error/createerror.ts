interface CustomError extends Error {
    statusCode?: number;
  }
  
  const createError = ({ message, statusCode }: { message: string; statusCode: number }): CustomError => {
    const error: CustomError = new Error();
    error.message = message;
    error.statusCode = statusCode;
    return error;
  };
  
  export = createError;
  


// error show page