export const ACTIONS = {
    "INITIALIZE": "INITIALIZE",
    "INITIALIZE_CANVAS": "INITIALIZE_CANVAS",
    "ON_IMAGE_LOAD": "ON_IMAGE_LOAD",
    "UPDATE_URLS": "UPDATE_URLS",
    "SET_LOADING": "SET_LOADING"
}

//utils section
function formatIconMappingData(rawData) {
    let formattedData = {};

    for (const key in rawData.frames) {
        const currentFrame = rawData.frames[key].frame;
        const newKey = key.replace('.png', "");
        formattedData = {
            ...formattedData,
            [newKey]: {
                x: currentFrame.x,
                y: currentFrame.y,
                width: currentFrame.w,
                height: currentFrame.h
            }
        }
    }

    return formattedData;
}

const generatePromiseForUrl = (state, action, keyname) => {
    const { byId } = state;
    const { ctx, target } = action.payload;

    return new Promise((resolve, reject) => {
        const { x, y, width, height } = byId[keyname];
        try {
            ctx.canvas.width = width;
            ctx.canvas.height = height;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(target, x, y, width, height, 0, 0, width, height);
            ctx.canvas.toBlob(function (blob) {
                const url = URL.createObjectURL(blob);
                resolve({ url, filename: keyname })
            });
        } catch (error) {
            reject({ error })
        }
    })
}

async function* asyncGenerator(state, action) {
    const { allIds } = state;
    for (let i = 0; i < allIds.length; i++) {
        const keyname = allIds[i];
        yield generatePromiseForUrl(state, action, keyname)
    }
}

async function getIconUrls(state, action) {
    let urls = [];
    for await (let url of asyncGenerator(state, action)) {
        urls.push(url)
    }
    return urls;
}
// utils section end



export default function fileReducer(state, action) {
    switch (action.type) {
        case ACTIONS.INITIALIZE: {
            const { iconMappingRaw } = action.payload;

            const byId = formatIconMappingData(iconMappingRaw);
            const allIds = Object.keys(byId);


            return { ...state, byId, allIds };
        }

        case ACTIONS.SET_LOADING: {
            return { ...state, loading: action.payload.loading }
        }

        case ACTIONS.ON_IMAGE_LOAD: {
            const dispatch = action.dispatch;
            getIconUrls(state, action).then((urls) => {
                dispatch({
                    type: ACTIONS.UPDATE_URLS,
                    payload: { urls }
                })
                dispatch({
                    type: ACTIONS.SET_LOADING,
                    payload: { loading: false }
                })
            })
            return state;
        }

        case ACTIONS.UPDATE_URLS: {
            let newByIds = {};

            for (let i = 0; i < state.allIds.length; i++) {
                const id = state.allIds[i];

                newByIds = {
                    ...newByIds,
                    [id]: {
                        ...state.byId[id],
                        url: action.payload.urls[i].url
                    }
                }
            }

            return {
                ...state,
                byId: newByIds
            }
        }

        default:
            return state;
    }
}
