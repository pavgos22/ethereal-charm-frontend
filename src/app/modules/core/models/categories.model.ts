export interface Category {
  name: string;
  shortId: number;
}

export type PostCategory = Omit<Category, 'shortId'>;
