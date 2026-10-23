let users = [];

const User = {
  findByEmail: (email) => users.find((user) => user.email === email),

  create: (user) => {
    users.push(user);
    return user;
  },

  findById: (id) => users.find((user) => user.id === id),

  getAll: () => users,
};

module.exports = User;
