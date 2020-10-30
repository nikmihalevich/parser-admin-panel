module.exports = (router) => {
    const routes = router();

    routes.get("/", (req, res) => {
        res.send("main router");
    });

    return routes;
};
