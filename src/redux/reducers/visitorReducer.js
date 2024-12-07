import { createReducer } from "@reduxjs/toolkit";
import {
  setQrToken,
  setNewQR,
  setQrDetail,
  setvisitorID,
} from "../actions/actions";

const initialState = {
  qrToken: localStorage.getItem("qrToken"),
  newQr: "",
  qrDetails: "",
  visitorID: "",
};

const visitorReducer = createReducer(initialState, (builder) => {
  builder.addCase(setQrToken, (state, action) => {
    state.qrToken = action.payload;
  });
  builder.addCase(setNewQR, (state, action) => {
    state.newQr = action.payload;
  });
  builder.addCase(setQrDetail, (state, action) => {
    state.qrDetails = action.payload;
  });
  builder.addCase(setvisitorID, (state, action) => {
    state.visitorID = action.payload;
  });
});

export default visitorReducer;
