import User from 'models/user';
import api from 'utils/clientApi';

const baseRoute: string = "/admin/users";

const userService = {
  async list(): Promise<User[]> {
    let userList:User[] = []
    try {
      const result = await api.get(`${baseRoute}`);
      userList = result.data;
      return userList;
    } catch(error) {
      throw new Error(error);
    }
  },

  async getOne(userId: number): Promise<User> {
    try {
      const result = await api.get<User>(`${baseRoute}/${userId}`);
      return result.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  
  async save(user: User) {
    try {
      console.log(user, 'UserUpdate');
      // return;
      const newUser: User = user.id ? 
      await api.patch(`${baseRoute}/${user.id}`, user) :
      await api.post(`${baseRoute}`, user);
      return newUser;
    } catch(error) {
      console.error(error)
    }
  },

  async delete(user: User) {
    try {
      const result = await api.delete(`${baseRoute}/${user.id}`);
      return result.data;
    } catch(error) {
      console.error(error)
    }
  }
}

export default userService