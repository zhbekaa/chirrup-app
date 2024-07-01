const db = require("../../database");
const profanity = require('@2toad/profanity').profanity;

const addNewPost = (post, user_id, done) => {
  const sql =
    "INSERT INTO posts (text, date_published, author_id) VALUES (?, ?, ?)";
  let values = [profanity.censor(post.text), Date.now(), user_id];

  db.run(sql, values, function (err) {
    if (err) return done(err);
    return done(null, this.lastID);
  });
};
const getLikes = (post_id) => {
  return new Promise((resolve, reject) => {
    const likesSql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                           FROM users u, likes l
                           WHERE l.post_id=?
                           AND l.user_id=u.user_id`;

    db.all(likesSql, [post_id], (err, likeRows) => {
      if (err) {
        reject(err);
      } else {
        const likes = likeRows.map((likeRow) => {
          return {
            user_id: likeRow.user_id,
            first_name: likeRow.first_name,
            last_name: likeRow.last_name,
            username: likeRow.username,
          };
        });
        resolve(likes);
      }
    });
  });
};
// const getLikes = (post_details, done) => {
//   const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username
//                   FROM users u, likes l
//                   WHERE l.post_id=?
//                   AND l.user_id=u.user_id`;
//   let likes = [];
//   db.each(
//     sql,
//     [post_details.post_id],
//     (err, row) => {
//       if (err) return done(err);
//       likes.push({
//         user_id: row.user_id,
//         first_name: row.first_name,
//         last_name: row.last_name,
//         username: row.username,
//       });
//     },
//     (err, num_row) => {
//       if (err) return done(err, null);
//       return done(null, likes)
//     }
//   );
// };
// const getPosts = (user_id, done) => {
//   const posts = [];
//   const sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
//                 FROM posts p, users u
//                 WHERE p.author_id = u.user_id
//                 AND u.user_id=?`;
//   db.each(
//     sql,
//     [user_id],
//     (err, post_details) => {
//       if (err) return done(err, null);
//       posts.push({
//         post_id: post_details.post_id,
//         timestamp: post_details.date_published,
//         text: post_details.text,
//         author: {
//           user_id: post_details.user_id,
//           first_name: post_details.first_name,
//           last_name: post_details.last_name,
//           username: post_details.username,
//         },
//         likes: [],
//       });
//     },
//     (err, num_row) => {
//       if (err) return done(err, null);
//       return done(null, posts);
//     }
//   );
// };
const getPosts = (user_id, done) => {
  let sql = "";
  if (user_id) {
    sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
    FROM posts p, users u
    WHERE p.author_id = u.user_id 
    AND u.user_id=?
    ORDER BY p.date_published DESC`;
  } else {
    sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
    FROM posts p, users u
    WHERE p.author_id = u.user_id ORDER BY p.date_published DESC`;
  }
  db.all(sql, [user_id], (err, rows) => {
    if (err) {
      return done(err, null);
    }

    const posts = rows.map((row) => {
      return {
        post_id: row.post_id,
        timestamp: row.date_published,
        text: row.text,
        author: {
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          username: row.username,
        },
        likes: [],
      };
    });

    const promises = posts.map((post) => {
      return getLikes(post.post_id).then((likes) => {
        post.likes = likes;
      });
    });

    Promise.all(promises)
      .then(() => {
        done(null, posts);
      })
      .catch((error) => {
        done(error, null);
      });
  });
};

const getSinglePost = (post_id, done) => {
  const sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                FROM posts p, users u
                WHERE p.post_id=?
                AND p.author_id = u.user_id`;
  db.get(sql, [post_id], (err, post_details) => {
    if (!post_details) return done(404, null);
    if (err) return done(err, null);
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                    FROM users u, likes l
                    WHERE l.post_id=?
                    AND l.user_id = u.user_id`;
    let likes = [];

    db.each(
      sql,
      [post_id],
      (err, row) => {
        if (err) return done(err);

        likes.push({
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          username: row.username,
        });
      },
      (err, num_row) => {
        return done(null, {
          post_id: post_details.post_id,
          timestamp: post_details.date_published,
          text: post_details.text,
          author: {
            user_id: post_details.user_id,
            first_name: post_details.first_name,
            last_name: post_details.last_name,
            username: post_details.username,
          },
          likes: likes,
        });
      }
    );
  });
};

const updatePost = (post, post_id, done) => {
  const sql = "UPDATE posts SET text=? WHERE post_id=?";
  let values = [profanity.censor(post.text), post_id];
  db.run(sql, values, function (err, row) {
    if (err) return done(err);
    return done(null, row);
  });
};

const deletePost = (post_id, done) => {
  const sql = `DELETE FROM posts WHERE post_id=?`;
  db.run(sql, [post_id], function (err) {
    if (err) return done(err);
    return done();
  });
};
const addLike = (post_id, user_id, done) => {
  const sql = `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`;
  db.run(sql, [post_id, user_id], function (err) {
    if (err == 404) return done(404);
    return done(err);
  });
};
const removeLike = (post_id, user_id, done) => {
  if (!user_id) {
    const sql = `DELETE FROM likes WHERE post_id=?`;
    db.run(sql, [post_id], function (err) {
      return done(err);
    });
  } else {
    const sql = `SELECT user_id, post_id FROM likes WHERE post_id=? AND user_id=?`;
    db.get(sql, [post_id, user_id], function (err, row) {
      if (!row || err) {
        return done(403, null);
      } else {
        const sql = `DELETE FROM likes WHERE post_id=? AND user_id=?`;
        db.run(sql, [post_id, user_id], function (err) {
          return done(err);
        });
      }
    });
  }
};

const authUserPost = (post_id, done) => {
  const sql = `SELECT author_id FROM posts WHERE post_id=?`;
  db.get(sql, [post_id], (err, id) => {
    if (err) return done(err, null);
    return done(null, id);
  });
};

module.exports = {
  addNewPost: addNewPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost,
  authUserPost: authUserPost,
  addLike: addLike,
  removeLike: removeLike,
  getPosts: getPosts,
};
