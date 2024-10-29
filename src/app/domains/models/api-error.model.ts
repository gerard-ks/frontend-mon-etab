export class ApiError extends Error {
  constructor(
    public code: string,
    public override message: string,
    public status?: number,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
