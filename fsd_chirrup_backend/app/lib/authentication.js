const user = require("../models/users.server.models");
const post = require("../models/posts.server.models");
isAuthenticated = (req, res, next) => {
  let token = req.get("X-Authorization");
  user.getIDFromToken(token, (row) => {
    if (!row) {
      return res.sendStatus(401);
    }
    req.user_id = row.user_id;
    next();
  });
};

authMatch = (req, res, next) => {
  let post_id = req.params.post_id;
  post.authUserPost(post_id, (err, row) => {
    if (!row) return res.status(404).send({error_message: "Post doesn't exist"})
    if(row.author_id != req.user_id) {
      return res.sendStatus(403);
    }
    next();
  });
};

module.exports = {
  isAuthenticated: isAuthenticated,
  authMatch: authMatch,
};
