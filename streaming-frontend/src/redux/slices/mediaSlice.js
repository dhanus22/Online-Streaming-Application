import { createSlice } from '@reduxjs/toolkit';

const mediaSlice = createSlice({
  name: 'media',
  initialState: { mediaList: [] },
  reducers: {
    setMediaList: (state, action) => {
      state.mediaList = action.payload;
    },
  },
});

export const { setMediaList } = mediaSlice.actions;
export default mediaSlice.reducer;
