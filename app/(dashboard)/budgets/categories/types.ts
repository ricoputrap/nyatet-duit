export interface ICategoryPageParams {
  search: string,
  sortKey: "name",
  sortOrder: 'asc' | 'desc',
}

export interface ICategory {
  id: string;
  name: string;
}