<template>
    <div class="d-flex flex-column align-items-stretch bg-white">

        <div class="p-1 border-bottom sticky-top bg-white">
            <slot></slot>
        </div>

        <div class="list-group list-group-flush border-bottom overflow-auto">
            <div v-for="item in items" :key="item.id"
            class="list-group-item list-group-item-action lh-tight"
            :class="{'active' : activeItemId == item.id}"
            aria-current="true"
            @click="itemClicked(item)"
            >
                    {{ item.name }}
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        // Array of objects {id, name}, where name will be displayed
        // and id will be passed as a parameter to $emit
        items: Array,
        // Item with this value as id will be highlited
        activeItemId: Number
    },
    emits: {
        // Is emmitted when user clicks on a list item. Item id is passed as an argument
        itemClicked : (id) => {return true}
    },
    methods: {
        itemClicked(new_item) {
            this.$emit('itemClicked', new_item.id, 10)
        }
    }
}
</script>

<style lang="scss" scoped>

.list-group-item.active {
    // filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    background-color: #5F7EF1;
    border-color: #5F7EF1;
    color: white;
}

.list-group-item {
    color: inherit;
    cursor: pointer;
}


</style>
