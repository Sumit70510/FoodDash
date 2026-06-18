import { createSlice , nanoid } from "@reduxjs/toolkit";

const initialState = {
    user : null,
    type : "user"
 }
 
export const authSlice = createSlice({
    name : "auth",
    initialState : initialState,
    reducers : {
        setAuthUser : (state,action) =>{
            state.user = action.payload.user||null;
            state.type = action.payload.type||"";
        },
         logout: (state) => {
         state.user = null;
       }
    }    
}) 

export const {setAuthUser,logout} = authSlice.actions;
export default authSlice.reducer;