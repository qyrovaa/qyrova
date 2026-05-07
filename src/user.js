// 📦 Get user
export const getUser = () => {
  return JSON.parse(localStorage.getItem("qyrovaUser"));
};

// 💾 Save user
export const saveUser = (user) => {
  localStorage.setItem("qyrovaUser", JSON.stringify(user));
};

// 🆕 Create new user
export const createUser = (email) => {
  const newUser = {
    email,

    degree: "",
    branch: "",
    role: "",

    isSetupComplete: false,
    isLoggedIn: true,

    reports: [],
    finalReport: null
  };

  saveUser(newUser);
  return newUser;
};

// 🔐 Login user
export const loginUser = (email) => {
  let user = getUser();

  if (!user || user.email !== email) {
    user = createUser(email);
  }

  user.isLoggedIn = true;
  saveUser(user);

  return user;
};

// 🚪 Logout
export const logoutUser = () => {
  const user = getUser();

  if (user) {
    user.isLoggedIn = false;
    saveUser(user);
  }
};

// ✅ Check login
export const isLoggedIn = () => {
  const user = getUser();
  return user && user.isLoggedIn;
};

// ✅ Check setup complete
export const isSetupComplete = (user) => {
  return user && user.degree && user.branch && user.role;
};