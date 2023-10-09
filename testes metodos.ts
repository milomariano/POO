//Código de Joao Pedro Mariano, RA 148212
import { App } from "./app";
import { Bike } from "./bike";
import { User } from "./user";
import sinon from "sinon";

describe("App", () => {
  let app: App;
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    app = new App();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it("deve calcular corretamente o valor do aluguel", async () => {
    const user = new User("user@email.com", "123");
    const bike = new Bike();
    app.addUser(user);
    app.registerBike(bike);

    app.rentBike(user.email, bike.id);
    clock.tick(2 * 60 * 60 * 1000);

    const valorAluguel = app.returnBike(bike.id);
    expect(valorAluguel).toEqual(20);
  });

  it("deve ser capaz de mover uma bicicleta para uma localização específica", () => {
    const bike = new Bike();
    app.registerBike(bike);
    const saoPaulo = { latitude: -23.550520, longitude: -46.633308 };

    app.updateBikeLocation(bike.id, saoPaulo.latitude, saoPaulo.longitude);

    expect(bike.location.latitude).toEqual(saoPaulo.latitude);
    expect(bike.location.longitude).toEqual(saoPaulo.longitude);
  });

  it("deve lançar uma exceção ao tentar mover uma bicicleta não registrada", () => {
    expect(() => {
      app.updateBikeLocation("fakeBikeId", -23.550520, -46.633308);
    }).toThrowError("Bicicleta não encontrada.");
  });

  it("deve ser capaz de adicionar um novo usuário", () => {
    const user = new User("usuario@email.com", "123");
    app.addUser(user);

    const usuarioEncontrado = app.findUser(user.email);
    expect(usuarioEncontrado).toEqual(user);
  });

  it("deve lançar um erro ao tentar adicionar um usuário com um email já existente", () => {
    const user = new User("usuario@email.com", "123");
    app.addUser(user);

    expect(() => app.addUser(new User("usuario@email.com", "456"))).toThrowError("Usuário com o mesmo email já cadastrado.");
  });

  it("deve autenticar o usuário com credenciais corretas", () => {
    const user = new User("usuario@email.com", "123");
    app.addUser(user);

    const autenticado = app.authUser(user.email, "123");
    expect(autenticado).toBeTruthy();
  });

  it("não deve autenticar o usuário com credenciais incorretas", () => {
    const user = new User("usuario@email.com", "123");
    app.addUser(user);

    const autenticado = app.authUser(user.email, "456");
    expect(autenticado).toBeFalsy();
  });

  it("deve registrar uma bicicleta com sucesso", () => {
    const bike = new Bike();
    app.registerBike(bike);

    expect(app.bikes).toContain(bike);
  });

  it("deve lançar um erro ao tentar registrar uma bicicleta duplicada", () => {
    const bike = new Bike();
    app.registerBike(bike);

    expect(() => app.registerBike(bike)).toThrowError("Bicicleta duplicada.");
  });

  it("deve remover um usuário com sucesso", () => {
    const user = new User("usuario@email.com", "123");
    app.addUser(user);
    app.removeUser(user);

    expect(app.users).not.toContain(user);
  });

  it("deve remover uma bicicleta com sucesso", () => {
    const bike = new Bike();
    app.registerBike(bike);
    app.removeBike(bike);

    expect(app.bikes).not.toContain(bike);
  });

  it("deve alugar uma bicicleta disponível com sucesso", () => {
    const user = new User("usuario@email.com", "123");
    const bike = new Bike();
    app.addUser(user);
    app.registerBike(bike);

    const bicicletaAlugada = app.rentBike(user.email, bike.id);

    expect(bicicletaAlugada).toEqual(bike);
    expect(bicicletaAlugada?.availability).toBeFalsy();
  });

  it("deve lançar um erro ao tentar alugar uma bicicleta indisponível", () => {
    const user = new User("usuario@email.com", "123");
    const bike = new Bike();
    app.addUser(user);
    app.registerBike(bike);
    bike.availability = false;

    expect(() => app.rentBike(user.email, bike.id)).toThrowError('Bicicleta não está disponível para aluguel.');
  });

  it("deve lançar um erro ao tentar alugar uma bicicleta para um usuário não registrado", () => {
    const bike = new Bike();
    app.registerBike(bike);

    expect(() => app.rentBike("fake@email.com", bike.id)).toThrowError('Usuário não encontrado.');
  });
});
