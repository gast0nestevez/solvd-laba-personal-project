export class Airline {
  constructor({ id, name }) {
    this.id = id
    this.name = name
  }
}

export const airlines = [
  new Airline({ id: 1, name: "American Airlines" }),
  new Airline({ id: 2, name: "Delta Air Lines" }),
  new Airline({ id: 3, name: "United Airlines" }),
  new Airline({ id: 4, name: "Lufthansa" }),
  new Airline({ id: 5, name: "Emirates" })
]
