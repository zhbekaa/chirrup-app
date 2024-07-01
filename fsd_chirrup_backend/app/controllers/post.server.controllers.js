const posts = require("../models/posts.server.models");
const users = require("../models/users.server.models");
const Joi = require("joi");

const add_post = (req, res) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.sendStatus(400);
  let post = Object.assign({}, req.body);

  posts.addNewPost(post, req.user_id, (err, post_id) => {
    if (err) return res.status(400).send(err);
    return res.status(201).send({ post_id: post_id });
  });
};
const get_post = (req, res) => {
  let post_id = req.params.post_id;
  posts.getSinglePost(post_id, (err, results) => {
    if (err == 404)
      return res.status(404).send({ error_message: "The post doesn't exist" });
    if (err) return res.status(400).send(err);
    return res.status(200).send(results);
  });
};
const update_post = (req, res) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.sendStatus(400);
  let id = req.params.post_id;
  let post = Object.assign({}, req.body);
  posts.updatePost(post, id, (err) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send({ post_id: id });
  });
};

const delete_post = (req, res) => {
  const post_id = req.params.post_id;
  posts.deletePost(post_id, (err) => {
    if (err) return res.status(404).send(err);
    posts.removeLike(post_id, null, (err) => {
      return res.status(200).send("Post Deleted");
    });
  });
};
const add_like = (req, res) => {
  const user_id = req.user_id;
  const post_id = req.params.post_id;
  posts.getSinglePost(post_id, (err) => {
    if (err == 404) return res.sendStatus(404);
    posts.addLike(post_id, user_id, (err) => {
      if (err)
        return res
          .status(403)
          .send({ error_message: "You already liked this post" });
      return res.status(200).send("Liked");
    });
  });
};
const remove_like = (req, res) => {
  const user_id = req.user_id;
  const post_id = req.params.post_id;
  posts.getSinglePost(post_id, (err) => {
    if (err == 404)
      return res.status(404).send({ error_message: "This post doesn't exist" });
    posts.removeLike(post_id, user_id, (err) => {
      if (err)
        return res
          .status(403)
          .send({ error_message: "You don't like this post" });
      return res.status(200).send("Like removed");
    });
  });
};
const feed = async (req, res) => {
  const token = req.get("X-Authorization");
  const row = await new Promise((resolve, reject) => {
    users.getIDFromToken(token, (row) => {
      resolve(row);
    });
  });

  const user_id = row?.user_id;

  if (user_id) {
    const following = await new Promise((resolve, reject) => {
      users.getFollowing(user_id, (err, following) => {
        if (err) reject(err);
        else resolve(following);
      });
    });

    const results = await Promise.all(
      following.map((f) => {
        return new Promise((resolve, reject) => {
          posts.getPosts(f.user_id, (err, posts) => {
            if (err) reject(err);
            else resolve(posts);
          });
        });
      })
    );

    const userPosts = await new Promise((resolve, reject) => {
      posts.getPosts(user_id, (err, posts) => {
        if (err) reject(err);
        else resolve(posts);
      });
    });

    const feedPosts = [...userPosts, ...results.flat()];
    return res.status(200).send(feedPosts);
  } else {
    const userPosts = await new Promise((resolve, reject) => {
      posts.getPosts(user_id, (err, posts) => {
        if (err) reject(err);
        else resolve(posts);
      });
    });

    return res.status(200).send(userPosts);
  }
};

module.exports = {
  add_post: add_post,
  get_post: get_post,
  update_post: update_post,
  delete_post: delete_post,
  add_like: add_like,
  remove_like: remove_like,
  feed: feed,
};
