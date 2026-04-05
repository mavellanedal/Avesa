export class FilterDto {
  public active: boolean;
  public maxResult: number;
  public first: number;
  public max: number;
  public sortBy: string;
  public orderBy: 'ASC' | 'DESC';
}
