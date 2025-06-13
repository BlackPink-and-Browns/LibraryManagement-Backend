export const processTimeMiddleware = (req, res, next) => {
  const startTime = Date.now(); // for simplicity
  const end = res.end;
  res.end = function (chunk, encoding) {
    const processTime = Date.now() - startTime;
    res.setHeader("X-Process-Time", processTime);
    end.call(res, chunk, encoding); // 'call' is not to lose the original binding of res.end to the response object
  };
  next();
};

export default processTimeMiddleware;
