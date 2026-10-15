import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketType: string;
  ticketCode: string;
  status: string;
  verificationCode: string;
  isVerified: boolean;
  setDetails: (details: Partial<UserState>) => void;
  clearDetails: () => void;
}


export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ticketType: 'Regular',
      ticketCode: 'CSV-456',
      status: 'Pending',
      verificationCode: '',
      isVerified: false,
      
      setDetails: (details) => set((state) => ({ ...state, ...details })),
      clearDetails: () => set({
        name: '',
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        ticketType: 'Regular',
        ticketCode: 'CSV-456',
        status: 'Pending',
        verificationCode: '',
        isVerified: false,
      }),
    }),
    {
      name: 'user-details-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);