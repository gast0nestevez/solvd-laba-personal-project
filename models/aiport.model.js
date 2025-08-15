export class Airport {
  constructor({ id, code, name, city, country, latitude, longitude }) {
    this.id = id
    this.code = code
    this.name = name
    this.city = city
    this.country = country
    this.latitude = latitude
    this.longitude = longitude
  }
}

// In-memory list of example airports
export const airports = [
  new Airport({
    id: 1,
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA',
    latitude: 40.6413,
    longitude: -73.7781
  }),
  new Airport({
    id: 2,
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'UK',
    latitude: 51.4700,
    longitude: -0.4543
  }),
  new Airport({
    id: 3,
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    latitude: 49.0097,
    longitude: 2.5479
  })
]
