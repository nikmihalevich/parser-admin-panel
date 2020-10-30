const User = require('../models/UserModel')

module.exports = (router) => {
    const routes = router();

    // auth
    routes.post("/login", async (req,res) => {
        const { login, password } = req.body
        const user = await User.findOne({ login })

        if(!user)
            return res.json({
                message: 'Пользователь не найден',
                success: false
            })

        if(password !== user.password)
            return res.json({
                message: "Неверный пароль",
                success: false
            })

        res.status(200).json({
            user,
            success: true
        })
    });

    // auth logout
    routes.post("/logout", (req, res) => {
        res.status(200).json({
            success: true
        });
    });

    return routes;
};
