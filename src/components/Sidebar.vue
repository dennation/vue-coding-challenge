<template>
    <div class="sidebar-warpper">
        <aside>
            <h3 class="mb-3">Filter projects</h3>

            <b-form-group id="fieldset-1" label="Project title">
                <b-form-input size="sm" v-model="filters.title" placeholder="Any title"></b-form-input>
            </b-form-group>

            <b-form-group id="fieldset-3" label="Project status">
                <b-form-select size="sm" v-model="filters.status" :options="statusOptions"></b-form-select>
            </b-form-group>

            <b-form-group
                id="fieldset-2"
                description="Pelase, select a range."
                label="Project value"
            >
                <input
                    type="text"
                    class="js-range-slider"
                    v-model="filters.value"
                    ref="value-input"
                />
            </b-form-group>

            <b-form-group id="fieldset-4" label="Commence Date Range">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <date-range-picker
                            ref="commenceDate"
                            v-model="filters.commenceDate"
                            opens="right"
                            :append-to-body="true"
                        ></date-range-picker>
                    </div>
                    <div class="col">
                        <b-button
                            variant="outline-primary"
                            size="sm"
                            @click="resetCommenceDate"
                        >Clear</b-button>
                    </div>
                </div>
            </b-form-group>

            <b-form-group id="fieldset-5" label="Project ownership">
                <b-form-select size="sm" v-model="filters.ownership" :options="ownershipOptions"></b-form-select>
            </b-form-group>

            <b-form-group id="fieldset-6" label="Project category">
                <b-form-checkbox-group
                    size="sm"
                    v-model="filters.category"
                    :options="categoryOptions"
                ></b-form-checkbox-group>
            </b-form-group>

            <b-button variant="success" @click="filterFeatures">Apply</b-button>
        </aside>
    </div>
</template>

<script>
import $ from "jquery";
import ionRangeSlider from "ion-rangeslider";
import DateRangePicker from "vue2-daterange-picker";

import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import "ion-rangeslider/css/ion.rangeSlider.css";

export default {
    name: "Sidebar",
    components: {
        DateRangePicker
    },
    data() {
        return {
            filters: {
                title: "",
                status: "",
                ownership: "",
                category: [],
                value: [],
                commenceDate: {}
            }
        };
    },
    created() {
        // Initial call to show all features
        this.filterFeatures();
    },
    mounted() {
        try {
            // Apply jQuery rang slider plugin
            $(this.$refs["value-input"]).ionRangeSlider({
                type: "double",
                min: this.valueOptions[0],
                max: this.valueOptions[1],
                from: this.valueOptions[0],
                to: this.valueOptions[1],
                grid: true,
                onChange: function(data) {
                    this.filters.value = [data.from, data.to];
                }.bind(this)
            });
        } catch (e) {
            console.log(`Sidebar mounting error: ${e}`);
        }
    },
    methods: {
        /**
         * Clear commence date
         */
        resetCommenceDate: function() {
            this.filters.commenceDate = {};
            this.$refs.commenceDate.start = null;
            this.$refs.commenceDate.end = null;
        },
        /**
         * Filter features
         */
        filterFeatures: function() {
            let features = this.$store.state.features.filter(feature => {
                try {
                    // Filter by project title
                    if (this.filters.title) {
                        let searchValue = this.filters.title
                            .trim()
                            .toUpperCase();
                        if (
                            feature.properties.project.Title.toUpperCase().indexOf(
                                searchValue
                            ) === -1
                        ) {
                            return false;
                        }
                    }

                    // Filter by project status
                    if (this.filters.status) {
                        let searchValue = this.filters.status
                            .trim()
                            .toUpperCase();
                        if (
                            feature.properties.project.Status.toUpperCase() !==
                            searchValue
                        ) {
                            return false;
                        }
                    }

                    // Filter by project value
                    if (this.filters.value.length > 0) {
                        let projectValue = parseFloat(
                            feature.properties.project.Value
                        );
                        if (
                            projectValue < this.filters.value[0] ||
                            projectValue > this.filters.value[1]
                        ) {
                            return false;
                        }
                    }

                    // Filter by project commence Date
                    if (
                        this.filters.commenceDate.startDate &&
                        this.filters.commenceDate.endDate
                    ) {
                        let dateParts = feature.properties.project[
                            "Commence Date"
                        ].split("/");
                        let projectCommenceDate = new Date(
                            "20" + dateParts[2],
                            dateParts[1],
                            dateParts[0]
                        );
                        let from = new Date(
                            this.filters.commenceDate.startDate
                        );
                        let to = new Date(this.filters.commenceDate.endDate);

                        if (
                            projectCommenceDate < from ||
                            projectCommenceDate > to
                        ) {
                            return false;
                        }
                    }

                    // Filter by project ownership
                    if (this.filters.ownership) {
                        let searchValue = this.filters.ownership
                            .trim()
                            .toUpperCase();
                        if (
                            feature.properties.project.Ownership.toUpperCase() !==
                            searchValue
                        ) {
                            return false;
                        }
                    }

                    // Filter by project category
                    if (this.filters.category.length > 0) {
                        let projectCategory = feature.properties.project.Category.trim();
                        if (
                            this.filters.category.indexOf(projectCategory) ===
                            -1
                        ) {
                            return false;
                        }
                    }
                } catch (e) {
                    console.log(`Error on filtering: ${e}`);
                    return false;
                }
                return true;
            });

            // Update filtered features
            this.$store.commit("showFeatures", features);
        }
    },
    computed: {
        /**
         * Calculate options for project status based on the test dataset
         */
        statusOptions: function() {
            try {
                return [
                    {
                        value: "",
                        text: "All"
                    },
                    ...[
                        ...new Set(
                            this.$store.state.features.map(
                                feature => feature.properties.project.Status
                            )
                        )
                    ].map(item => {
                        return {
                            value: item,
                            text: item
                        };
                    })
                ];
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        /**
         * Calculate options for project ownership based on the test dataset
         */
        ownershipOptions: function() {
            try {
                return [
                    {
                        value: "",
                        text: "All"
                    },
                    ...[
                        ...new Set(
                            this.$store.state.features.map(
                                feature => feature.properties.project.Ownership
                            )
                        )
                    ].map(item => {
                        return {
                            value: item,
                            text: item
                        };
                    })
                ];
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        /**
         * Calculate options for project category based on the test dataset
         */
        categoryOptions: function() {
            try {
                return [
                    ...new Set(
                        this.$store.state.features.map(
                            feature => feature.properties.project.Category
                        )
                    )
                ];
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        /**
         * Calculate options for project value based on the test dataset
         */
        valueOptions: function() {
            try {
                let sortedValues = [
                    ...new Set(
                        this.$store.state.features.map(feature =>
                            parseFloat(feature.properties.project.Value)
                        )
                    )
                ].sort((a, b) => b - a);
                return [sortedValues[sortedValues.length - 1], sortedValues[0]];
            } catch (e) {
                console.log(e);
                return [];
            }
        }
    }
};
</script>

<!-- Scoped attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sidebar-warpper {
    background: white;
    position: absolute;
    padding: 20px 30px;
    box-sizing: border-box;
    overflow-y: auto;

    top: 4vh;
    max-height: 92vh;

    left: 2vw;
    width: 400px;

    box-shadow: 10px 18px 33px 20px #00000087;
}
</style>
