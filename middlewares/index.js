const notFound = (req, res, next) => {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.render("404", {
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "" : err.stack,
        user: req.user ? req.user : null,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
