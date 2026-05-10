import { Expose } from 'class-transformer';

export class ResponseDataDto<T> {
  @Expose()
  data: T;

  @Expose()
  totalCount: number;

  constructor(data: T, totalCount: number) {
    this.data = data;
    this.totalCount = totalCount;
  }
}
