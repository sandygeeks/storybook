import { CommonModule } from "@angular/common";
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from "@storybook/angular";
import { PureTaskListComponent } from "./pure-task-list.component";
import { TaskComponent } from "./task.component";
import * as TaskStories from "./task.stories";

export default {
    component: PureTaskListComponent,
    decorators: [
        moduleMetadata({
            // Imports both components to allow component composition with Storybook
            declarations: [PureTaskListComponent, TaskComponent],
            imports: [CommonModule]
        }),
        // wrap our stories with a directory
        componentWrapperDecorator(story => `<div style="margin:3rem"> ${story}</div>`),
    ],
    title: 'PureTaskList'
} as Meta;

const Template: Story = args => ({
    props: {
        ...args,
        onPinTask: TaskStories.actionsData.onPinTask,
        onArchiveTask: TaskStories.actionsData.onArchiveTask,
    }
});

export const Default = Template.bind({});
Default.args = {
    tasksInOrder: [
        { ...TaskStories.Default.args?.['task'], id: 1, title: 'Task 1' },
        { ...TaskStories.Default.args?.['task'], id: 2, title: 'Task 2' },
        { ...TaskStories.Default.args?.['task'], id: 3, title: 'Task 3' },
        { ...TaskStories.Default.args?.['task'], id: 4, title: 'Task 4' },
        { ...TaskStories.Default.args?.['task'], id: 5, title: 'Task 5' },
        { ...TaskStories.Default.args?.['task'], id: 6, title: 'Task 6' },
    ]
}

export const WithPinnedTask = Template.bind({});
WithPinnedTask.args = {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasksInOrder: [
        ...Default.args['tasksInOrder'].slice(0, 5),
        { id: 6, title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ]
}


export const Loading = Template.bind({});
Loading.args = {
    tasksInOrder: [],
    loading: true,
}

export const Empty = Template.bind({});
Empty.args = {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
}