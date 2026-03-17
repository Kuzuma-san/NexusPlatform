import { ROLES } from "./roles";
import { USERS } from "./users";

export const USER_ROLES = {//mapping the emails to roles...
    //admin has 4 roles only to show user can have multiple roles but is not necessary for ADMIN
    [USERS.ADMIN_USER_TESTER.email]: [
        ROLES.ADMIN,
        ROLES.SELLER,
        ROLES.USER,
    ],
    [USERS.SELLER_USER_TESTER.email]: [ROLES.SELLER],
    [USERS.USER_USER_TESTER.email]: [ROLES.USER],
    // [USERS.GUEST_USER_TESTER.email]: [ROLES.GUEST],
}
// export const USER_ROLE_MAPPING = [
//   {
//     userEmail: USERS.ADMIN_USER_TESTER.email,
//     roleName: ROLES.ADMIN,
//   },
//   {
//     userEmail: USERS.SELLER_USER_TESTER.email,
//     roleName: ROLES.SELLER,
//   },
//   {
//     userEmail: USERS.USER_USER_TESTER.email,
//     roleName: ROLES.USER,
//   },
//   {
//     userEmail: USERS.GUEST_USER_TESTER.email,
//     roleName: ROLES.GUEST,
//   },
// ];
