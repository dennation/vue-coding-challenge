<template>
    <MglMap :accessToken="accessToken" :mapStyle="mapStyle" @load="onMapLoaded" id="map">
        <!-- Render marker on the map for each of the shown features -->
        <MglMarker
            v-for="feature in $store.state.shownFeatures"
            :key="feature.properties.id"
            :coordinates="feature.geometry.coordinates"
            color="blue"
        />
    </MglMap>
</template>

<script>
import { MglMap, MglMarker } from "vue-mapbox";
import mapboxgl from "mapbox-gl";

export default {
    name: "Map",
    components: { MglMap, MglMarker },
    data() {
        return {
            map: null,
            accessToken: process.env.MAPBOX_ACCESS_TOKEN, // Use access_token from current environment
            mapStyle: "mapbox://styles/mapbox/satellite-v9"
        };
    },
    methods: {
        /**
         * Handle map load event
         */
        onMapLoaded(event) {
            this.map = event.map;
            this.updateMapView();
        },
        /**
         * Update map view area
         */
        updateMapView() {
            try {
                if (this.map && this.$store.state.shownFeatures.length > 0) {
                    let bounds = new mapboxgl.LngLatBounds();
                    this.$store.state.shownFeatures.forEach(function(feature) {
                        bounds.extend(feature.geometry.coordinates);
                    });
                    this.map.fitBounds(bounds);
                }
            } catch (e) {
                console.log(`Error on the update map view: ${e}`);
            }
        }
    },
    watch: {
        /**
         * Update map view area when shownFeatures is changed
         */
        "$store.state.shownFeatures": {
            deep: true,
            handler() {
                this.updateMapView();
            }
        }
    }
};
</script>

<!-- Scoped attribute to limit CSS to this component only -->
<style scoped>
#map {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>