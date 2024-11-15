import { createReducer } from "@reduxjs/toolkit";
import { setQrToken } from "../actions/actions";

const initialState = {
  qrToken: localStorage.getItem("qrToken"),
};

const visitorReducer = createReducer(initialState, (builder) => {
  builder.addCase(setQrToken, (state, action) => {
    state.qrToken = action.payload;
  });
});

export default visitorReducer;
