import { configureStore } from "@reduxjs/toolkit";
import visitorReducer from "./reducers/visitorReducer";

const store = configureStore({
  reducer: {
    visitor: visitorReducer,
  },
});

export default store;