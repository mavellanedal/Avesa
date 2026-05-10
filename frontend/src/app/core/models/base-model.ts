export abstract class BaseModel {
  public id!: number;

  constructor(id: number) {
    if (id) {
      this.id = id;
    }
  }
}
