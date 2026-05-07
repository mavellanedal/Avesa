import { Expose } from 'class-transformer';

export class ResponseDataDto<T> {
  @Expose()
  data: T;

  @Expose()
  totalCount: number;
}
