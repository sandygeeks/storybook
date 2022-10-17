import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { patch, updateItem } from '@ngxs/store/operators';
import { Task } from "../models/task.model";

//Defines the actions available to the app
export const actions = {
    ARCHIVE_TAST: 'ARCHIVE_TASL',
    PIN_TASK: 'PIN_TASK',
    ERROR: 'APP_ERROR'
}

export class ArchiveTask {
    static readonly type = actions.ARCHIVE_TAST;
    constructor(public payload: string) { }
}
export class PinTask {
    static readonly type = actions.PIN_TASK;
    constructor(public payload: string) { }
}

export class AppError {
    static readonly type = actions.ERROR;
    constructor(public payload: boolean) { }
}
// The initial state of our own store when the app loads
// Usually, you would fetch this from a server
const defaultTasks = [
    { id: '1', title: 'Something', state: 'TASK_INBOX' },
    { id: '2', title: 'Something more', state: 'TASK_INBOX' },
    { id: '3', title: 'Something else', state: 'TASK_INBOX' },
    { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

export interface TaskStateModel {
    tasks: Task[],
    status: 'idle' | 'loading' | 'success' | 'error';
    error: boolean;
}

// sets the default state
@State<TaskStateModel>({
    name: 'taskbox',
    defaults: {
        tasks: defaultTasks,
        status: 'idle',
        error: false,
    },
})
@Injectable()
export class TasksState {
    // Defines a new selector for the error field
    @Selector()
    static getError(state: TaskStateModel): boolean {
        return state.error;
    }

    @Selector()
    static getAllTasks(state: TaskStateModel): Task[] {
        return state.tasks;
    }


    // Triggers the PinTask action, similar to redux
    @Action(PinTask)
    pinTask(
        { getState, setState }: StateContext<TaskStateModel>,
        { payload }: PinTask
    ) {
        const task = getState().tasks.find((task) => task.id === payload);

        if (task) {
            const updatedTask: Task = {
                ...task,
                state: 'TASK_PINNED',
            };
            setState(
                patch({
                    tasks: updateItem<Task>(
                        (pinnedTask) => pinnedTask?.id === payload,
                        updatedTask
                    ),
                })
            );
        }
    }

    // Triggers the archiveTask action, similar to redux
    @Action(ArchiveTask)
    archiveTask(
        { getState, setState }: StateContext<TaskStateModel>,
        { payload }: ArchiveTask
    ) {
        const task = getState().tasks.find((task) => task.id === payload);
        if (task) {
            const updatedTask: Task = {
                ...task,
                state: 'TASK_ARCHIVED',
            };
            setState(
                patch({
                    tasks: updateItem<Task>(
                        (archivedTask) => archivedTask?.id === payload,
                        updatedTask
                    ),
                })
            );
        }
    }

    // Function to handle how the state should be updated when the action is triggered
    @Action(AppError)
    setAppErro(
        { patchState, getState }: StateContext<TaskStateModel>,
        { payload }: AppError
    ) {
        const state = getState();
        patchState({
            error: !state.error,
        });
    }
}