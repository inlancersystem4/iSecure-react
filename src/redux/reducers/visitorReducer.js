import { createReducer } from "@reduxjs/toolkit";
import { setQrToken, setNewQR , setQrDetail } from "../actions/actions";

const initialState = {
  qrToken: localStorage.getItem("qrToken"),
  newQr: "",
  qrDetails: "",
};

const visitorReducer = createReducer(initialState, (builder) => {
  builder.addCase(setQrToken, (state, action) => {
    state.qrToken = action.payload;
  });
  builder.addCase(setNewQR, (state, action) => {
    console.log(action);
    state.newQr = action.payload;
  });
  builder.addCase(setQrDetail, (state, action) => {
    state.qrDetails = action.payload;
  });
});

export default visitorReducer;
