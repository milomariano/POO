//Código de Joao Pedro Mariano, RA 148212

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

class Bike {
  id: string;
}

class User {
  id: string;
  email: string;
  password: string;
  passwordHash: string;

  constructor(email: string, password: string) {
    this.id = '';
    this.email = email;
    this.password = password;
    this.passwordHash = '';
  }

  setPassword(password: string): void {
    const saltRounds = 10;
    this.passwordHash = bcrypt.hashSync(password, saltRounds);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}

class Rent {
}

class App {
  users: User[] = [];
  bikes: Bike[] = [];
  rents: Rent[] = [];

  addUser(user: User): void {
    if (this.users.some(existingUser => existingUser.email === user.email)) {
      throw new Error('User with the same email already registered.');
    }
    user.setPassword(user.password);
    this.users.push(user);
  }

  findUser(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  authenticateUser(userId: string, password: string): User | undefined {
    const user = this.findUser(userId);
    if (user && user.checkPassword(password)) {
      return user;
    }
    return undefined;
  }

  registerBike(bike: Bike): void {
    if (this.bikes.some(existingBike => existingBike.id === bike.id)) {
      throw new Error('Duplicate bike ID.');
    }
    bike.id = crypto.randomUUID();
    this.bikes.push(bike);
  }

  removeUser(user: User): void {
    this.users = this.users.filter(existingUser => existingUser.id !== user.id);
  }

  removeBike(bike: Bike): void {
    this.bikes = this.bikes.filter(existingBike => existingBike.id !== bike.id);
  }

  rentBike(bike: Bike, user: User, startDate: Date, endDate: Date): Rent {
    return new Rent();
  }

  listUsers(): User[] {
    return this.users;
  }

  listRents(): Rent[] {
    return this.rents;
  }

  listBikes(): Bike[] {
    return this.bikes;
  }
}

const app = new App();

const user1 = new User('user1@example.com', 'password1');
app.addUser(user1);

const authenticatedUser = app.authenticateUser('user1@example.com', 'password1');
if (authenticatedUser) {
  console.log('User authenticated:', authenticatedUser.email);
} else {
  console.log('Authentication failed.');
}

const bike1 = new Bike();
app.registerBike(bike1);

const usersList = app.listUsers();
const bikesList = app.listBikes();

console.log('Users:', usersList);
console.log('Bikes:', bikesList);
