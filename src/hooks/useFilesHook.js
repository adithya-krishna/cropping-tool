import React from 'react';
import ICON_MAPPING_RAW from "../assets/spritesheet/spritesheet.json";
import fileReducer, { ACTIONS } from '../reducers/fileReducer';

const initialState = {
  byId: {},
  allIds: [],
  selectedIds: [],
  loading: false,
  ctx: null,
  imageURL: null
};

export default function useFiles({ imageURL }) {
  const [state, dispatch] = React.useReducer(fileReducer, initialState);

  React.useEffect(() => {
    const canvas = document.getElementById('canvas-element');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = (e) => {
      dispatch({
        type: ACTIONS.ON_IMAGE_LOAD,
        payload: {
          ctx,
          target: e.target,
          filename: 'spritesheet',
        },
        dispatch
      })
    }
    img.src = imageURL;

    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: { loading: true }
    })
    dispatch({
      type: ACTIONS.INITIALIZE,
      payload: { iconMappingRaw: ICON_MAPPING_RAW }
    })
  }, [])

  return state;
}