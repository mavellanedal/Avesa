export class ApiError {
  status?: number;
  errorCode?: string;
  message?: string;
  details?: string[] | any;
  path?: string;
  timestamp?: string;
}
