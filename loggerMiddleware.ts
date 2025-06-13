const loggerMiddleware = (req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`,
    );
  });
  // Call next middleware, or handler
  next();
};

export default loggerMiddleware;
