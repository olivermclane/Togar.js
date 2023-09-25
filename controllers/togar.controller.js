const togarView = (req, res) => {
    res.render("togar", {
        user: req.user
    });
}

module.exports = {
    togarView
}