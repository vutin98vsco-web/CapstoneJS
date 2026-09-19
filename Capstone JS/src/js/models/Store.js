export default class Store {
  constructor({ id, name, address, hours, phone }) {
    this.id = String(id);
    this.name = name.trim();
    this.address = address.trim();
    this.hours = hours.trim();
    this.phone = phone.trim();
  }
}
