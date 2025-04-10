"use client"
import {
    applyMiddleware,
    combineReducers,
    createStore,
    compose,
    Store,
} from "redux";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import { thunk, ThunkMiddleware } from "redux-thunk";
import logger from "redux-logger";
import utilsReducer from "../reducers/utils.reducer";
import nodesReducer from "../reducers/nodes.reducer";

// Extend Window interface for Redux DevTools
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

// application reducers
const rootReducer = combineReducers({
    utils: utilsReducer,
    nodes: nodesReducer,
});

// Define the state type
export type RootState = ReturnType<typeof rootReducer>;

// Define persist config type
const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage,
    transforms: [
        encryptTransform({
            secretKey: "dummy-secret",
            onError: (error) => {
                console.error("Encryption error:", error);
            },
        }),
    ],
    blacklist: [],
};

// Configure persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Use Redux DevTools composeEnhancer if available
const composeEnhancers =
    (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Create the store only when on the client.
// On the server, create the store without persistence.
const store: Store<RootState> =
    typeof window !== "undefined"
        ? createStore(
              persistedReducer,
              composeEnhancers(applyMiddleware(thunk as unknown as ThunkMiddleware<RootState>)) //, logger))
          )
        : createStore(rootReducer);

// Create the persistor only on the client side
const persistor = typeof window !== "undefined" ? persistStore(store) : null;

export { store, persistor };