import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: "analytics",
  initialState: {
    username: null,
    postid:null,
    type:null,
    isRead: false
  },
  reducers: {
    resetNotificationState: (state) => {
      state.username = null;
      state.postid = null;
      state.type = null;
      state.isRead = null
    },
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateNotification: (state,action)=>{
        state.username=action.payload.username;
        state.postid=action.payload.postid;
        state.type=action.payload.type;
        state.isRead=action.payload.isRead;
    }
  },
});

export const { resetNotificationState, updateField, updateNotification } =notificationSlice.actions;
export default notificationSlice.reducer;