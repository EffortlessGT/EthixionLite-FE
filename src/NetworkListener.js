import { useEffect } from 'react';
import { toast } from 'sonner';

const NetworkListener = () => {
  useEffect(() => {
    const handleOffline = () => {
      toast.error('No internet connection...');
    };

    const handleOnline = () => {
      toast.success('Back online!');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
};

export default NetworkListener;
