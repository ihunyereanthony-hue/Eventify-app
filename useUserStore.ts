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
  eventId: string;
  attendeeId: string;
  eventName: string;
  eventWhen: string;
  eventVenue: string;
  eventDescription: string;
  eventImage: string;
  qrToken: string;
  qrCode: string;
  setDetails: (details: Partial<UserState>) => void;
  clearDetails: () => void;
}

const emptyDetails = {
  name: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  ticketType: 'Regular',
  ticketCode: '',
  status: 'Pending',
  verificationCode: '',
  isVerified: false,
  eventId: '',
  attendeeId: '',
  eventName: '',
  eventWhen: '',
  eventVenue: '',
  eventDescription: '',
  eventImage: '',
  qrToken: '',
  qrCode: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...emptyDetails,
      setDetails: (details) => set((state) => ({ ...state, ...details })),
      clearDetails: () => set(emptyDetails),
    }),
    {
      name: 'user-details-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
