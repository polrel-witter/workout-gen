import { StrictMode } from 'react';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { ReactView } from './components/ReactView';

export const VIEW_TYPE_WORKOUT = 'workout-view';

export class WorkoutView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE_WORKOUT;
    }

    getDisplayText(): string {
        return 'Workout Generator';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("div", { attr: { id: "workout-view-root" } });

        this.root = createRoot(container.querySelector("#workout-view-root")!);
        this.root.render(
            <StrictMode>
              <ReactView />
            </StrictMode>
        );
    }

    async onClose() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}
