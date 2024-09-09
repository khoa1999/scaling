import { createSlice, configureStore } from '@reduxjs/toolkit';
import _ from 'lodash';
//import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
const slice = createSlice({
    name: 'workSession',
    initialState: {
        currentPlant: "",
        plants: [],
        zones: [],
        traySegments: [],
        cables:[],
    },
    reducers: {
        setPlant: (state, action) => {
            state.currentPlant = action.payload;
        },
        addPlant: (state, action) => {
            state.currentPlant = action.payload;
            state.plants.push(action.payload); 
        },
        removePlant: (state, action) => {
            state.plants = state.plants.filter(plant => plant !== action.payload);
        },
        addZone: (state, action) => {
            const payload = action.payload;
            if ('parentPlant' in payload && 'name' in payload) {
                state.zones.unshift(payload);
            }
        },
        removeZone: (state, action) => {
            state.zones = state.zones.filter(zone => !_.isEqual(zone, action.payload));
        },
        addTraySegment: (state, action) => {
            const payload = action.payload;
            if ('name' in payload && 'parentZone' in payload && 'len' in payload && 'cables' in payload) {
                state.traySegments.unshift(payload);
            }
        },
        removeTraySegment: (state, action) => {
            const payload = action.payload;
            state.cables = state.cables.filter(cable => cable.segments.length !== 1 && !_.isEqual(cable.segments[0], payload));
            state.cables.forEach((cable, index) => {
                state.cables[index].segments = cable.segments.filter(segment => !_.isEqual(segment, payload));
            });
            state.traySegments = state.traySegments.filter(traySegment => !_.isEqual(traySegment, payload));
        },
        addCable: (state, action) => {
            const payload = action.payload;
            if ('cableId' in payload && 'segments' in payload && 'name' in payload) {
                state.cables.unshift(payload);
                payload.segments.forEach(segment => {
                    state.traySegments.forEach((value, index) => {
                        if (_.isEqual(value, segment)) {
                            state.traySegments[index].cables.unshift(payload);
                        }
                    });
                });
            }
        },
        removeCable: (state, action) => {
            state.cables = state.cables.filter(cable => !_.isEqual(cable, action.payload));
            state.traySegments.forEach((tray, index) => {
                state.traySegments[index].cables = tray.cables.filter(cable => !_.isEqual(cable, action.payload));
            });
        },
        addCableToTraySegment: (state, action) => {
            const { traySegment, cable } = action.payload;
            cable.segments.unshift(traySegment);

            state.cables.forEach((existingCable, index) => {
                if (_.isEqual(existingCable, cable)) {
                    state.cables[index] = cable;
                }
            });

            state.traySegments.forEach((segment, index) => {
                if (_.isEqual(segment, traySegment)) {
                    segment.cables.unshift(cable);
                }
            });
        }
    },
});
export const { addPlant, removePlant, addZone, removeZone, addTraySegment, removeTraySegment, addCable, removeCable, addCableToTraySegment } = slice.actions
export const history = createBrowserHistory();

const store = configureStore({
    reducer:slice.reducer
})
export default store;
/*const store = configureStore({
    reducer: {
        router: connectRouter(history),
        workSession: slice.reducer,
        // other reducers
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(routerMiddleware(history)),
});8/
export default store;
/*
        removeTraySegment: (state, payload) => {
            let cables = state.cables.filter((cable) => cable.segments.length !== 1 && !_.isEqual(cable.segments[0], payload));
            state.cables.forEach((cable,index) => { cables[index].segments = cable.segments.filter((segment) => !_.isEqual(segment, payload)) });
            const traySegments = state.traySegments.filter((traySegment) => _.isEqual(traySegment, payload));
            return { cables, traySegments, ...state };
        },
        addCable: (state, payload) => {
            if ('cableId' in payload && 'segments' in payload && 'name' in payload) {
                const cables = [payload, ...state.cables];
                let traySegments = [...state.traySegments];
                payload.segments.forEach((segment) => {
                    state.traySegments.forEach((value, index) => {
                        if (_.isEqual(value, segment)) {
                            traySegments[index].cables = [payload, ...segment.cables];
                        }
                    });
                });
                return { cables,traySegments ,...state };
            }
            return state;
        },
        removeCable: (state, payload) => {
            const cables = state.cables.filter((cable) => { !_.isEqual(cable, payload) });
            let traySegments = [...state.traySegments];
            state.traySegments.forEach((tray,index) => {
                traySegments[index].cables = tray.cables.filter((cable) => {!_.isEqual(cable,payload) });
            });
            return { cables,traySegments,...state };
        },
        addCableToTraySegment: (state, payload) => {
            payload.cable.segments = [traySegment, ...payload.cable.segments]
            //const cable = payload.cable;
            state.cables.forEach((cable,index) => {
                if (_.isEqual(cable, payload.cable)) {
                    state.cables[index] = [payload.traySegment, ...state.cables[index]];
                }
            })
            state.traySegments.forEach((traySegment,index) => {
                if (_.isEqual(traySegment, payload.traySegment)) {
                    state.traySegments[index].cables = [payload.cable,...state.traySegments[index].cables]
                }
            })
            return {...state};
        }
    },
});
*/