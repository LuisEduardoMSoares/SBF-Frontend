import User from 'models/user';
import api from 'utils/clientApi';

const userService = {
  async list(): Promise<User[]> {
    let userList:User[] = []
    try {
      const result = await api.get('/users');
      userList = result.data;
      return userList;
    } catch(error) {
      throw new Error(error);
    }
  },

  async getOne(userId: number): Promise<User> {
    try {
      const result = await api.get<User>(`/users/${userId}`);
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
      await api.patch(`/users/${user.id}`, user) :
      await api.post('/users', user);
      return newUser;
    } catch(error) {
      console.error(error)
    }
  },

  async delete(user: User) {
    try {
      const result = await api.delete(`/users/${user.id}`);
      return result.data;
    } catch(error) {
      console.error(error)
    }
  }
}

export default userService