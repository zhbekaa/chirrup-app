const users = require("../models/users.server.models");
const Joi = require("joi");
const posts = require("../models/posts.server.models");
const get_user = (req, res) => {
  const user_id = req.params.user_id;
  if (!user_id || user_id == undefined) return res.sendStatus(400);
  let user_followers = [];
  let user_following = [];
  let user_posts = [];
  const likes = [];
  const getPromise = new Promise((resolve, reject) => {
    Promise.race([
      Promise.all([
        new Promise((resolvePosts) => {
          posts.getPosts(user_id, (err, results) => {
            if (err) resolvePosts([]);
            resolvePosts(results);
          });
        }),
        new Promise((resolveFollowers) => {
          users.getFollowers(user_id, (err, results) => {
            if (err) resolveFollowers([]);
            resolveFollowers(results);
          });
        }),
        new Promise((resolveFollowing) => {
          users.getFollowing(user_id, (err, results) => {
            if (err) resolveFollowing([]);
            resolveFollowing(results);
          });
        }),
      ]),
    ])

      .then(([postsResults, followersResults, followingResults]) => {
        resolve({
          posts: postsResults,
          followers: followersResults,
          following: followingResults,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  getPromise
    .then(({ posts, followers, following }) => {
      users.getSingleUser(
        user_id,
        followers,
        following,
        posts,
        (err, result) => {
          if (err) {
            return res.status(404).send({ error_message: err });
          }
          return res.status(200).send(result);
        }
      );
    })
    .catch((err) => {
      return res.status(500).send({ error_message: err });
    });
};
const add_user = (req, res) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,18}$/
      )
      .required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error_message: "Validation error" });
  let user = Object.assign({}, req.body);
  users.addNewUser(user, (err, id) => {
    if (err) return res.status(400).send(err);
    return res.status(201).send({ user_id: id });
  });
};

const login_user = (req, res) => {
  let token = req.get("X-Authorization");
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,18}$/;

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(passwordPattern).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error_message: "Validation Error" });
  users.authenticateUser(req.body.username, req.body.password, (err, id) => {
    if (err)
      return res.status(err.status).send({ error_message: err.message });
    users.getToken(id, function (err, token) {
      if (!token || token == " ") {
        users.setToken(id, function (err, newToken) {
          if (err) return res.sendStatus(500);
          return res.status(200).send({ user_id: id, session_token: newToken });
        });
      } else {
        return res.status(200).send({ user_id: id, session_token: token });
      }
    });
  });
};

const logout_user = (req, res) => {
  let token = req.get("X-Authorization");
  users.removeToken(token, (err) => {
    if (err == 400) return res.sendStatus(400);
    if (err) return res.sendStatus(500);
    return res.status(200).send("Logged out");
  });
};

const add_follow = (req, res) => {
  const user_id = req.params.user_id;
  const follower_id = req.user_id;
  users.getSingleUser(user_id, null, null, null, (err, username) => {
    if (!username)
      return res.status(404).send({ error_message: "User Not Found" });
    if (err) return res.status(500).send({ error_message: "err" });
    users.addFollow(user_id, follower_id, (err, row) => {
      if (err)
        return res
          .status(403)
          .send({ error_message: "You already follow this user" });
      return res.sendStatus(200);
    });
  });
};
const delete_follow = (req, res) => {
  follower_id = req.user_id;
  user_id = req.params.user_id;
  users.getSingleUser(user_id, null, null, null, (err, username) => {
    if (!username)
      return res.status(404).send({ error_message: "User Not Found" });
    if (err) return res.status(500).send({ error_message: "err" });
    users.deleteFollow(user_id, follower_id, (err, row) => {
      if (err)
        return res
          .status(403)
          .send({ error_message: "You already unfollowed this user" });
      return res.sendStatus(200);
    });
  });
};

const search_user = (req, res) => {
  let query = `%%`;
  if (req.query.q) query = `%${req.query.q}%`;
  users.searchUser(query, (results, err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(results);
  });
};
module.exports = {
  add_user: add_user,
  login_user: login_user,
  logout_user: logout_user,
  get_user: get_user,
  add_follow: add_follow,
  delete_follow: delete_follow,
  search_user: search_user,
};
