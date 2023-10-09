import * as crypto from 'crypto';
import { Bike } from './bike';
import { Rent } from './rent';
import { User } from './user';

export class App {
  users: User[] = [];
  bikes: Bike[] = [];
  rents: Rent[] = [];

  addUser(user: User): void {
    if (this.users.some(existingUser => existingUser.email === user.email)) {
      throw new Error('User with same email already registered.');
    }
    this.users.push(user);
  }

  findUser(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  registerUser(user: User): void {
    if (this.users.some(existingUser => existingUser.email === user.email)) {
      throw new Error('Duplicate user.');
    }
    user.id = crypto.randomUUID();
    this.users.push(user);
  }

  removeUser(user: User): void {
    this.users = this.users.filter(existingUser => existingUser.id !== user.id);
  }

  removeBike(bike: Bike): void {
    this.bikes = this.bikes.filter(existingBike => existingBike.id !== bike.id);
  }

  rentBike(bike: Bike, user: User, startDate: Date, endDate: Date): Rent {
    return Rent.create(this.rents, bike, user, startDate, endDate);
  }

  registerBike(bike: Bike): void {
  if (this.bikes.some(existingBike => existingBike.id === bike.id)) {
    throw new Error('Duplicate bike ID.');
  }
  bike.id = crypto.randomUUID();
  this.bikes.push(bike);
}

}
