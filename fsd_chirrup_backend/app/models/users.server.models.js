const db = require("../../database");
const crypto = require("crypto");
const getHash = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 256, "sha256")
    .toString("hex");
};
const getFollowers = (user_id, done) => {
  let followers = [];
  const sql = `SELECT f.follower_id AS user_id, u.first_name, u.last_name, u.username 
  FROM users u, followers f
  WHERE f.user_id=?
  AND u.user_id=f.follower_id`;
  db.each(sql, [user_id], (err, follower_details) => {
    if (err) return done(err);
    followers.push(follower_details)
  },
  (err, num_row) => {
    return done(null, followers);
  });
};
const getFollowing = (user_id, done) => {
  let following = [];
  const sql = `SELECT f.user_id, u.first_name, u.last_name, u.username 
  FROM users u, followers f
  WHERE f.follower_id=?
  AND u.user_id = f.user_id`;
  db.each(sql, [user_id], (err, following_details) => {
    if (err) return done(err);
    following.push(following_details)
  },
  (err, num_row) => {
    return done(null, following);
  });
};
const getSingleUser = (user_id, followers, following, posts, done) => {
  if (!followers && !following && !posts) {
    const sql = `SELECT username FROM users WHERE user_id=?`;
    db.get(sql, [user_id], (err, username) => {
      if (err) return done(err, null);
      return done(null, username);
    });
  } else {
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username FROM users u WHERE user_id=?`;
    db.get(sql, [user_id], (err, user_details) => {
      if (!user_details) return done(404, null);
      if (err) return done(err, null);
      return done(null, {
        user_id: user_details.user_id,
        first_name: user_details.first_name,
        last_name: user_details.last_name,
        username: user_details.username,
        followers: followers,
        following: following,
        posts: posts,
      });
    });
  }
};
const addNewUser = (user, done) => {
  const salt = crypto.randomBytes(64);
  const hash = getHash(user.password, salt);
  const sql =
    "INSERT INTO users (first_name, last_name, username, password, salt) VALUES (?, ?, ?, ?, ?)";
  let values = [
    user.first_name,
    user.last_name,
    user.username,
    hash,
    salt.toString("hex"),
  ];
  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(null, this.lastID);
  });
};
const authenticateUser = (username, password, done) => {
  const sql = `SELECT user_id, password, salt FROM users WHERE username=?`;
  db.get(sql, [username], (err, row) => {
    if (err) return done(err);
    if (!row) return done({ status: 400, message: "No user with this username"}, null);

    if (row.salt === null) row.salt = "";
    let salt = Buffer.from(row.salt, "hex");
    if (row.password === getHash(password, salt))
      return done(null, row.user_id);
    else return done({ status: 400, message: "Invalid Password"}, null);
  });
};

const getToken = (id, done) => {
  const sql = `SELECT session_token FROM users WHERE user_id=?`;
  db.get(sql, [id], (err, row) => {
    if (err) return done(err);
    if (!row) return done(404);
    return done(null, row.session_token);
  });
};

const setToken = (id, done) => {
  let token = crypto.randomBytes(16).toString("hex");

  const sql = `UPDATE users SET session_token=? WHERE user_id=?`;

  db.run(sql, [token, id], function (err) {
    if (err) return done(err);
    return done(err, token);
  });
};

const removeToken = (token, done) => {
  const sql = `UPDATE users SET session_token=null WHERE session_token=?`;
  db.run(sql, [token], (err) => {
    return done(err);
  });
};

const getIDFromToken = (token, done) => {
  const sql = `SELECT user_id FROM users WHERE session_token=?`;
  db.get(sql, [token], (id, err) => {
    if (err) return done(err);
    return done(id);
  });
};

const addFollow = (user_id, follower_id, done) => {
  const sql = `INSERT INTO followers (user_id, follower_id) VALUES (?, ?)`;
  db.run(sql, [user_id, follower_id], (err, row) => {
    if (err) return done(404);
    return done(row);
  });
};

const deleteFollow = (user_id, follower_id, done) => {
  const sql = `SELECT user_id, follower_id FROM followers WHERE user_id=? AND follower_id=?`;
  db.get(sql, [user_id, follower_id], (err, row) => {
    if (!row || err) {
      return done(403, null);
    } else {
      const sql = `DELETE FROM followers WHERE user_id=? AND follower_id=?`;
      db.run(sql, [user_id, follower_id], (err) => {
        return done(err);
      });
    }
  });
};

const searchUser = (query, done) => {
  const sql = `SELECT user_id, first_name, last_name, username FROM users 
  WHERE username LIKE ?
  OR first_name LIKE ?
  OR last_name LIKE ?
  `;
  let users = [];
  db.each(
    sql,
    [query, query, query],
    (err, row) => {
      if (err) return done(err + "");
      users.push(row);
    },
    (err, num_row) => {
      if (err) return done(err + "");
      return done(users);
    }
  );
};
module.exports = {
  addNewUser: addNewUser,
  authenticateUser: authenticateUser,
  getToken: getToken,
  setToken: setToken,
  removeToken: removeToken,
  getIDFromToken: getIDFromToken,
  getSingleUser: getSingleUser,
  addFollow: addFollow,
  deleteFollow: deleteFollow,
  searchUser: searchUser,
  getFollowers: getFollowers,
  getFollowing: getFollowing,
};
