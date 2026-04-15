
import { User } from "../src/users/entities/user.entity";
import bcrypt from 'bcrypt';
export const USERS = [
    {
        username: 'admin-user-tester',
        email: 'admin-user-tester@email.com',
        password: 'admin-user-tester'
    },
    {
        username: 'seller-user-tester',
        email: 'seller-user-tester@email.com',
        password: 'seller-user-tester'
    },
    {
        username: 'user-user-tester',
        email: 'user-user-tester@email.com',
        password: 'user-user-tester'
    },
    // {
    //     username: 'guest-user-tester',
    //     email: 'guest-user-tester@email.com',
    //     password: 'guest-user-tester'
    // }
]
//initial users to seed and test these users for differnt roles and testing

export async function seedUsers() {
  for (const user of USERS) {
    await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        username: user.username,
        password: await bcrypt.hash(user.password, 10),
        email: user.email
      },
    });
  }
}