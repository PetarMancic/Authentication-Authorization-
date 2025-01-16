import { createSlice } from "@reduxjs/toolkit";

const initialState={
   rememberMe:false,
   name:""
}

const rememberMeSlice = createSlice({
  name: "rememberMe",
  initialState,
  reducers: {
    setRememberMe: (state, action) => {  // Ovde je trebalo da bude "=>"
      state.rememberMe = action.payload;
      console.log("vrednost koju sam dobio je ", action.payload);
    },

    setName:(state,action)=>
    {
      state.name=action.payload
    }
  },
});


export const {setRememberMe,setName}= rememberMeSlice.actions;

export default rememberMeSlice.reducer;
