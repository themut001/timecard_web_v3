import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import attendanceSlice from './slices/attendanceSlice';
import tagsSlice from './slices/tagsSlice';
import reportsSlice from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    attendance: attendanceSlice,
    tags: tagsSlice,
    reports: reportsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;