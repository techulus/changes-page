export interface IErrorResponse {
  error: {
    statusCode: number;
    message: string;
  };
}

export interface IAnalyticsData {
  data_name: string;
  data_count: number;
}
