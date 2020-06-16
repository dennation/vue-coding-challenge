import Vue from 'vue'
import Vuex from 'vuex'

// import test dataset
import Dataset from "./testBlob.json";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        features: Dataset.features,
        shownFeatures: []
    },
    mutations: {
        // update shownFeatures
        showFeatures(state, features) {
            state.shownFeatures = features
        }
    }
});