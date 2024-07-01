import axios from "axios";
const getSinglePost = (id) => {
  const url = "http://localhost:3333/posts/" + id;
  return axios
    .get(url)
    .then((res) => {
      if (res.status == 200) {
        return res.data;
      }
      if (res.status == 404) {
        throw "Post doesn't exist";
      }
    })
    .catch((err) => {
      return err;
    });
};
const getFeed = () => {
  const url = "http://localhost:3333/feed";
  const token = localStorage.getItem("X-Authorization");

  return axios
    .get(url, {
      headers: {
        "X-Authorization": token,
      }
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
const addLike = (post_id) => {
  const url = `http://localhost:3333/posts/${post_id}/like`;
  const token = localStorage.getItem("X-Authorization");

  return axios
    .post(url, {}, {
      headers: {
        "X-Authorization": token,
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err
    })
}
const deleteLike = (post_id) => {
  const url = `http://localhost:3333/posts/${post_id}/like`;
  const token = localStorage.getItem("X-Authorization");
  return axios
    .delete(url, {
      headers: {
        "X-Authorization": token,
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    })
}

const addPost = (text) => {
  const url = `http://localhost:3333/posts`;
  const token = localStorage.getItem("X-Authorization");

  return axios
    .post(url, {
      "text": text,
    }, {
      headers: {
        "X-Authorization": token,
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err
    })
}

const editPost = (text, id) => {
  const url = `http://localhost:3333/posts/${id}`;
  const token = localStorage.getItem("X-Authorization");

  return axios
    .patch(url, {
      "text": text,
    }, {
      headers: {
        "X-Authorization": token,
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err
    })
}

const deletePost = (id) => {
  const url = `http://localhost:3333/posts/${id}`;
  const token = localStorage.getItem("X-Authorization");

  return axios
    .delete(url, {
      headers: {
        "X-Authorization": token,
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err
    })
}
export const postService = {
  getFeed,
  getSinglePost,
  addLike,
  deleteLike,
  addPost,
  editPost,
  deletePost
};

