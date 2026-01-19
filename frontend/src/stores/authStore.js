export const authStore = {
  getUser: () => {
    const user = localStorage.getItem("use");

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      console.log(error);
      return null ; 
    }
  },
  set : (dataUser) => {
    localStorage.setItem("user" , dataUser)
  },
  clear : () => {
    localStorage.clear("user");
  }
};
