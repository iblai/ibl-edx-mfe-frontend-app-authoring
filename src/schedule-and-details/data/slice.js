/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

import { RequestStatus } from "../../data/constants";

const slice = createSlice({
  name: "scheduleAndDetails",
  initialState: {
    loadingDetailsStatus: RequestStatus.IN_PROGRESS,
    loadingSettingsStatus: RequestStatus.IN_PROGRESS,
    loadingMfeConfigStatus: RequestStatus.IN_PROGRESS,
    savingStatus: "",
    courseDetails: {},
    courseSettings: {},
    mfeConfig: {},
  },
  reducers: {
    updateLoadingDetailsStatus: (state, { payload }) => {
      state.loadingDetailsStatus = payload.status;
    },
    updateLoadingSettingsStatus: (state, { payload }) => {
      state.loadingSettingsStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateLoadingMfeConfigStatus: (state, { payload }) => {
      state.loadingMfeConfigStatus = payload.status;
    },
    updateCourseDetailsSuccess: (state, { payload }) => {
      Object.assign(state.courseDetails, payload);
    },
    fetchCourseDetailsSuccess: (state, { payload }) => {
      Object.assign(state.courseDetails, payload);
    },
    fetchCourseSettingsSuccess: (state, { payload }) => {
      Object.assign(state.courseSettings, payload);
    },
    fetchMfeConfigSuccess: (state, { payload }) => {
      Object.assign(state.mfeConfig, payload);
    },
  },
});

export const {
  updateSavingStatus,
  updateLoadingDetailsStatus,
  updateLoadingSettingsStatus,
  updateLoadingMfeConfigStatus,
  updateCourseDetailsSuccess,
  fetchCourseDetailsSuccess,
  fetchCourseSettingsSuccess,
  fetchMfeConfigSuccess,
} = slice.actions;

export const { reducer } = slice;
