<template>
    <q-dialog v-model="dialog_status">
        <q-card>
            <q-card-section>
                <div class="text-h6">Выбор даты</div>
            </q-card-section>
            <q-card-section>
                <!-- <q-date :v-model="current_data" color="dark" /> -->
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: data,
    data () {
        return {
            dialog_status: data
        }

    },
}
</script>