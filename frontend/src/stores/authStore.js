export const authStore = {
  getUser: () => {
    const user = localStorage.getItem("user");

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
    localStorage.setItem("user" , JSON.stringify(dataUser))
  },
  clear : () => {
    localStorage.clear("user");
  }
};
