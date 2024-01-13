<template>
	<v-container fluid class="h-screen">
		<v-menu
      v-model="model.information"
      :close-on-content-click="false"
      location="start">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
					icon
					size="small"
					class="float-end bg-grey-lighten-1">
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item
            title="This application uses the browser's local storage to store data.">
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

		<v-row dense class="h-100 d-flex justify-center align-center">
			<v-col cols="12" md="4" lg="4">
				<h1 class="text-center">To do List</h1>
				<v-card>
					<v-card-text>
						<v-form ref="taskForm" @submit.prevent="createNewTask()">
							<v-row class="mb-2 mt-4">
								<v-col cols="12">
									<v-text-field
										v-model="model.name"
										clearable
										label="New Task"
										variant="outlined"
										hide-details="auto"
										:rules="[rules.required, rules.counter]"
										append-inner-icon="mdi-plus-circle"
										@click:append-inner="createNewTask()">
									</v-text-field>
								</v-col>
							</v-row>
						</v-form>

						<template v-if="tasks.length > 0">
							<v-divider class="mb-4"></v-divider>

							<v-row dense>
								<v-col
									cols="12"
									md="6"
									class="d-inline-flex border justify-space-between align-center rounded pa-3 text-uppercase justify mb-2">
									Remaining Tasks
									<v-chip class="bg-info">{{ tasks.length }}</v-chip>
								</v-col>
								<v-col
									cols="12"
									md="6"
									class="d-inline-flex border justify-space-between align-center rounded pa-3 text-uppercase justify mb-2">
									Tag as done
									<v-chip class="bg-success">{{ tasks.filter((task) => !task.status).length }}</v-chip>
								</v-col>
							</v-row>
							<v-divider class="my-4"></v-divider>

							<v-row dense class="mb-4">
								<v-col
									cols="12"
									md="6"
									sm="6"
									class="d-inline-flex justify-space-between align-center text-uppercase justify">
									<v-btn
										:disabled="tasks.filter((task) => !task.status).length < 1"
										class="bg-success"
										text="REMOVE ALL TAG AS DONE"
										prepend-icon="mdi-check" block
										@click.prevent="openRemoveAllTagAsDoneModal()">
									</v-btn>
								</v-col>
								<v-col
									cols="12"
									md="6"
									sm="6"
									class="d-inline-flex justify-space-between align-center text-uppercase justify">
									<v-btn
										class="bg-error"
										text="REMOVE ALL TASK"
										prepend-icon="mdi-delete"
										block
										@click.prevent="openRemoveAllTaskModal()">
									</v-btn>
								</v-col>
							</v-row>

							<v-card
								v-if="tasks.length > 0"
								v-scroll.self="onScroll"
								class="overflow-y-auto"
								max-height="200"
								variant="outlined">
								<v-slide-x-transition class="py-0" group tag="v-list">
									<template v-for="(task, index) in tasks" :key="index">
										<v-divider v-if="index !== 0" :key="`${index}-divider`"></v-divider>
										<v-list-item class="py-4">
											<template v-slot:prepend>
												<v-tooltip :text="task.status ? 'Tag as done?' : 'Tag as undone?'" location="start">
													<template v-slot:activator="{ props }">
														<v-btn
															v-bind="props"
															size="x-small"
															:class="!task.status ? 'bg-grey-lighten-1' : 'bg-success'"
															icon
															@click.stop="tagAsDone(task)">
															<v-icon v-if="task.status" size="x-large">mdi-check</v-icon>
															<v-icon v-else size="x-large">mdi-close</v-icon>
														</v-btn>
													</template>
												</v-tooltip>
											</template>

											<v-list-item-title>
												<span :class="!task.status ? 'text-grey text-decoration-line-through' : ''" class="pa-5">
													{{ task.name }}
												</span>
											</v-list-item-title>

											<template v-slot:append>
												<v-tooltip text="Remove this task?" location="end">
													<template v-slot:activator="{ props }">
														<v-btn
															v-bind="props"
															size="x-small"
															class="bg-error"
															icon
															@click="removeTask(task)">
															<v-icon size="x-large">mdi-delete</v-icon>
														</v-btn>
													</template>
												</v-tooltip>
											</template>
										</v-list-item>
									</template>
								</v-slide-x-transition>
							</v-card>
						</template>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-dialog
			v-model="model.dialog"
			transition="dialog-bottom-transition"
			persistent
			width="500">
			<template v-slot:default="{ isActive }">
				<v-card	:title="model.isRemoveAllTask ? 'Remove all tasks' : 'Remove all tag as done'">
					<v-card-text class="text-center my-7">
						Are you sure you want to remove all {{ model.isRemoveAllTask ? 'task' : 'tag as done' }}?
						You won't be able to revert this action.
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn v-if="model.isRemoveAllTask" text="Yes" class="bg-success" @click="removeAllTasks()"></v-btn>
						<v-btn v-else text="Yes" class="bg-success" @click="removeAllTagAsDone()"></v-btn>
						<v-btn text="No" class="bg-error" @click="model.dialog = false"></v-btn>
					</v-card-actions>
				</v-card>
			</template>
		</v-dialog>
		<v-snackbar
      v-model="model.snackbar"
			timeout="5000">
      {{ model.snackbarMessage }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="model.snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
	</v-container>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { computed } from 'vue';
import { reactive } from 'vue';
import { useStore } from "vuex";

const store = useStore();
const taskForm = ref();
const tasks = computed(() => { return store.getters["tasks/list"]; });

const rules = reactive({
	required: value => !!value || 'This field is required.',
	counter: value => value.length <= 60 || 'This field must be less than 60 characters',
});

const model = reactive({
	scrollInvoked: 0,
	isLoading: false,
	dialog: false,
	snackbar: false,
	snackbarMessage: null,
	isRemoveAllTask: false,
	name: null,
});

const onScroll = () => {
	model.scrollInvoked++
}

const createNewTask = async () => {
	model.isLoading = true;
	const { valid } = await taskForm.value.validate();

	if (valid) {
		const lastId = tasks.value.length > 0 ? tasks.value[tasks.value.length - 1].id : 0;
		store.dispatch("tasks/save", {
			id: lastId + 1,
			name: model.name,
			status: true
		});
	}
	model.snackbarMessage = 'Task has been created successfully!';
	model.snackbar = true;
	model.name = null;
	model.isLoading = false;
}

const tagAsDone = (task) => {
	store.dispatch('tasks/tagAsDone', task);
}

const removeAllTagAsDone = () => {
	const data = tasks.value.filter(task => task.status !== true).map(task => task.id);
	model.dialog = false;
	model.snackbarMessage = 'All task tag as done has been removed successfully!';
	model.snackbar = true;
	store.dispatch('tasks/removeAllTagAsDone', data);
}

const removeAllTasks = () => {
	model.dialog = false;
	model.isRemoveAllTask = false;
	model.snackbarMessage = 'All task has been removed successfully!';
	model.snackbar = true;
	store.dispatch('tasks/removeAllTasks');
}

const openRemoveAllTagAsDoneModal = () => {
	model.dialog = true;
}

const openRemoveAllTaskModal = () => {
	model.dialog = true;
	model.isRemoveAllTask = true;
}

const removeTask = (task) => {
	store.dispatch("tasks/destroy", task);
	model.snackbarMessage = 'Task has been removed successfully!';
	model.snackbar = true;
}

const getAllTasks = () => {
	model.isLoading = true;
	store.dispatch('tasks/paginate');
}

onBeforeMount(async () => {
	await getAllTasks();
});
</script>
