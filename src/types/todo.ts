/**
 * Todo type definitions
 */

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoDto {
  title: string;
  completed?: boolean;
  userId?: number;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

export interface TodosResponse {
  data: Todo[];
  total: number;
}

export interface TodoFilters {
  userId?: number;
  completed?: boolean;
  _limit?: number;
  _page?: number;
}
