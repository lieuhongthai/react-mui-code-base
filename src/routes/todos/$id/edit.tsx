import { createFileRoute } from '@tanstack/react-router';
import { TodoEditPage } from '@/pages/TodoEditPage';

export const Route = createFileRoute('/todos/$id/edit')({
  component: TodoEditPage,
});
