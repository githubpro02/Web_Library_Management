export default class User {
    constructor(id, firstName, lastName, email, password, confirmPassword,oldPassword, newPassword, role) {
      this.id = id
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
      this.confirmPassword = confirmPassword;
      this.oldPassword = oldPassword;
      this.newPassword = newPassword;
      this.role = role;
    }
  }