import { GET_ERRORS, GET_RESPONSE, EVENTS_LOADING, ORGANIZERS_LOADING, SPONSORS_LOADING } from './types';

export const refreshErrors = () => {
  return {
    type: GET_ERRORS,
    payload: {}
  };
};

export const refreshResponse = () => {
  return {
    type: GET_RESPONSE,
    payload: {}
  };
};

export const getError = data => {
  return {
    type: GET_ERRORS,
    payload: data
  };
};

export const getResponse = data => {
  return {
    type: GET_RESPONSE,
    payload: data
  };
};

export const setLoading = data => {
  switch (data) {
    case 'event': {
      return {
        type: EVENTS_LOADING
      };
    }
    case 'organizer': {
      return {
        type: ORGANIZERS_LOADING
      };
    }
    case 'sponsor': {
      return {
        type: SPONSORS_LOADING
      };
    }
  }
};
