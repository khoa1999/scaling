import React, { createContext, useReducer, ReactNode,useEffect } from 'react';
import _ from 'lodash';
// here we can initialise with any value we want.
const initialState = {
    currentPlant: "",
    plants: [],
    zones: [],
    traySegments: [],
    cables: [],
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PLANT':
            return { ...state, currentPlant: action.payload };

        case 'ADD_PLANT':
            return {
                ...state,
                currentPlant: action.payload,
                plants: [...state.plants, action.payload]
            };

        case 'REMOVE_PLANT':
            return {
                ...state,
                plants: state.plants.filter(plant => plant !== action.payload)
            };

        case 'ADD_ZONE':
            if ('parentPlant' in action.payload && 'name' in action.payload) {
                return { ...state, zones: [action.payload, ...state.zones] };
            }
            return state;

        case 'REMOVE_ZONE':
            return {
                ...state,
                zones: state.zones.filter(zone => !_.isEqual(zone, action.payload))
            };

        case 'ADD_TRAY_SEGMENT':
            const trayPayload = action.payload;
            if ('name' in trayPayload && 'parentZone' in trayPayload && 'len' in trayPayload && 'cables' in trayPayload) {
                return { ...state, traySegments: [trayPayload, ...state.traySegments] };
            }
            return state;

        case 'REMOVE_TRAY_SEGMENT':
            const traySegmentPayload = action.payload;
            const updatedCables = state.cables.map(cable => ({
                ...cable,
                segments: cable.segments.filter(segment => !_.isEqual(segment, traySegmentPayload))
            })).filter(cable => cable.segments.length > 0);

            return {
                ...state,
                cables: updatedCables,
                traySegments: state.traySegments.filter(traySegment => !_.isEqual(traySegment, traySegmentPayload))
            };

        case 'ADD_CABLE':
            return { ...state, cables: [action.payload, ...state.cables] };

        default:
            return state;
    }
};// Create Context
const init = (initialState) => {
    const savedState = sessionStorage.getItem('globalState');
    return savedState ? JSON.parse(savedState) : initialState;
};
/*export const GlobalContext = createContext({
    state: initialState,
    dispatch: () => null,
});*/
export const GlobalContext = createContext();
// Provider Component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    useEffect(() => {
        sessionStorage.setItem('globalState', JSON.stringify(state));
    }, [state]);
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};

/*const Context = React.createContext({});
export const MainProvider = Context.Provider;
export const MainConsumer = Context.Consumer;
export default Context;*/