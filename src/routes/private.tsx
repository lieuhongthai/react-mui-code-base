import { createFileRoute, redirect } from '@tanstack/react-router';
import { PrivatePage } from '@/pages/PrivatePage';
import { useAuthStore } from '@/stores/authStore';

export const Route = createFileRoute('/private')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: PrivatePage,
});
