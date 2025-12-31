import { createFileRoute } from '@tanstack/react-router';
import { TodoCreatePage } from '@/pages/TodoCreatePage';

export const Route = createFileRoute('/todos/create')({
  component: TodoCreatePage,
});
