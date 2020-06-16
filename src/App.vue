<template>
    <div id="app">
        <!-- The map component -->
        <Map/>
        <!-- The sidebar component -->
        <Sidebar/>
    </div>
</template>

<script>
// Import requred components
import Map from "./components/Map.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
    name: "App",
    components: {
        Map,
        Sidebar
    }
};
</script>