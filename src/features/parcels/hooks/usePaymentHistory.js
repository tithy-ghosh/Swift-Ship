import { useQuery } from '@tanstack/react-query';
import { getMyPaymentHistory } from '../api/parcelApi'; // Adjust path as needed

export const usePaymentHistory = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['paymentHistory', page, limit],
    // ✅ axiosSecure automatically attaches the token here!
    queryFn: () => getMyPaymentHistory(page, limit),
    // Optional: Only fetch if the user is actually logged in (prevents 401 errors on load)
    // enabled: !!user, 
  });
};