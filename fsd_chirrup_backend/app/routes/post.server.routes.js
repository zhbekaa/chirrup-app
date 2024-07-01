const posts = require('../controllers/post.server.controllers')
const auth = require('../lib/authentication')

module.exports = function (app) {
    app.route('/posts')
        .post(auth.isAuthenticated, posts.add_post);
    app.route('/posts/:post_id')
        .get(posts.get_post)
        .patch(auth.isAuthenticated, auth.authMatch, posts.update_post)
        .delete(auth.isAuthenticated, auth.authMatch, posts.delete_post);
    app.route('/posts/:post_id/like')
        .post(auth.isAuthenticated, posts.add_like)
        .delete(auth.isAuthenticated, posts.remove_like);
    app.route('/feed')
        .get(posts.feed);
}