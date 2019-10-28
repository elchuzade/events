import axios from 'axios';

import {
  refreshErrors,
  refreshResponse,
  getError,
  getResponse,
  setLoading
} from './commonActions';

import { GET_EVENT, GET_EVENTS } from './types';

const refreshAll = () => dispatch => {
  dispatch(refreshErrors());
  dispatch(refreshResponse());
  dispatch(getResponse());
};

export const getEvents = () => dispatch => {
  dispatch(setLoading('events'));
  refreshAll();
  axios
    .get(`/api/event/`)
    .then(res => {
      dispatch({
        type: GET_EVENTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(getError(err.response.data));
    });
};

export const getEvent = (id) => dispatch => {
  dispatch(setLoading('event'));
  refreshAll();
  axios
    .get(`/api/event/${id}`)
    .then(res => {
      dispatch({
        type: GET_EVENT,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(getError(err.response.data));
    });
};
