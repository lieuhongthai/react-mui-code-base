import { Toaster } from 'sonner';
import { useThemeStore } from '@/stores/themeStore';
import { toastConfig } from '@/config/toast';

/**
 * ToastProvider wraps the app with Sonner's Toaster component
 * Applies global toast configuration and syncs with app theme
 */
export function ToastProvider() {
  const { mode } = useThemeStore();

  return (
    <Toaster
      {...toastConfig}
      theme={mode}
      toastOptions={{
        style: toastConfig.style,
        className: 'sonner-toast',
      }}
    />
  );
}
