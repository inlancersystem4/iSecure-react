import { createReducer } from "@reduxjs/toolkit";
import { setQrToken, setNewQR } from "../actions/actions";

const initialState = {
  qrToken: localStorage.getItem("qrToken"),
  newQr: "",
};

const visitorReducer = createReducer(initialState, (builder) => {
  builder.addCase(setQrToken, (state, action) => {
    state.qrToken = action.payload;
  });
  builder.addCase(setNewQR, (state, action) => {
    console.log(action)
    state.newQr = action.payload;
  });
});

export default visitorReducer;
