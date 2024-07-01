const users = require('../controllers/user.server.controllers')
const auth = require('../lib/authentication')
module.exports = function (app) {
    app.route("/users")
        .post(users.add_user);
    app.route('/users/:user_id')
        .get(users.get_user);
    app.route('/login')
        .post(users.login_user);
    app.route('/logout')
        .post(auth.isAuthenticated, users.logout_user);
    app.route("/users/:user_id/follow")
        .post(auth.isAuthenticated, users.add_follow)
        .delete(auth.isAuthenticated, users.delete_follow);
    app.route("/search")
        .get(users.search_user);
}