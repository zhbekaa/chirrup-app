import axios from "axios";
const login = (username, password) => {
  const url = "http://localhost:3333/login";
  return axios
    .post(
      url,
      {
        username: username,
        password: password,
      },
      {
        "X-Authorization": localStorage.getItem("X-Authorization"),
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
const signup = (first_name, last_name, username, password) => {
  const url = "http://localhost:3333/users";
  return axios
    .post(url, {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
const getUser = async (id) => {
  const url = "http://localhost:3333/users/" + id;
  const res = await axios.get(url);
  return res.data;
};

const logout = () => {
  const url = "http://localhost:3333/logout";
  const token = localStorage.getItem("X-Authorization");
  return axios
    .post(
      url,
      {},
      {
        headers: {
          "X-Authorization": token,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const search = (input) => {
  const url = "http://localhost:3333/search?q=" + input;
  return axios
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const follow = (id) => {
  const url = `http://localhost:3333/users/${id}/follow`;
  const token = localStorage.getItem("X-Authorization");
  return axios
    .post(
      url,
      {},
      {
        headers: {
          "X-Authorization": token,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const unfollow = (id) => {
  const url = `http://localhost:3333/users/${id}/follow`;
  const token = localStorage.getItem("X-Authorization");
  return axios
    .delete(
      url,
      {
        headers: {
          "X-Authorization": token,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const userService = {
  login,
  signup,
  getUser,
  logout,
  search,
  follow,
  unfollow
};
