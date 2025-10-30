export interface ICategoryPageParams {
  search?: string,
  sortKey?: "name",
  sortOrder?: 'asc' | 'desc',
  edit?: string,
}

export interface ICategory {
  id: string;
  name: string;
}