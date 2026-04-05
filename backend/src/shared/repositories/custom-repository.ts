import { Repository } from 'typeorm';

export class CustomRepository<T> extends Repository<T> {
  protected firstOrNull(values): T | null {
    let result: T = null;

    if (values != null && values.length > 0) {
      result = values[0];
    }

    return result;
  }

  protected paginateResults(
    values: any[],
    first: number,
    max: number,
    total: number,
    limit: boolean = false,
  ) {
    if (limit) {
      total = values.length < total ? values.length : total;
    }
    values = values.slice(first - 1, max);
    return [values, total];
  }

  public desactivateRecords(ids) {
    return this.createQueryBuilder()
      .update()
      .set(<any>{ active: 0 })
      .whereInIds(ids)
      .execute();
  }
}
