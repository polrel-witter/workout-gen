import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { VIEW_TYPE_WORKOUT, WorkoutView } from './WorkoutView';
import { WorkoutSettings } from './types/settings';
import { ExerciseListService } from './services/ExerciseListService';

const DEFAULT_SETTINGS: WorkoutSettings = {
    // TODO hardcoded for now
    rootFolder: './workouts',
    exerciseListPath: 'Exercises.md'
};

export default class WorkoutGenPlugin extends Plugin {
    settings: WorkoutSettings;

    async onload() {
        console.log('loading plugin');
        await this.loadSettings();

        // Register the custom view
        this.registerView(
            VIEW_TYPE_WORKOUT,
            (leaf) => new WorkoutView(leaf)
        );

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('dice', 'WorkoutGen View', () => {
            this.activateView();
            new Notice('WorkoutGen');
        });
        ribbonIconEl.addClass('workout-gen-ribbon-class');

        // Add command to open view
        this.addCommand({
            id: 'open-workout-view',
            name: 'Open WorkoutGen',
            callback: () => {
              this.activateView();
            }
        });

        // Add settings tab
        this.addSettingTab(new WorkoutSettingTab(this.app, this));
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('unloading workout-gen plugin');
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(VIEW_TYPE_WORKOUT)[0];
        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({
                type: VIEW_TYPE_WORKOUT,
                active: true,
            });
        }
        workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        // Load settings first
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

        // Then init services with proper settings
        const exerciseService = new ExerciseListService(this.settings);

        try {
            const exercises = await exerciseService.loadExercises();
            // TODO store exercises where needed
            console.log('Loaded exercises:', exercises);
        } catch (error) {
	          new Notice('Failed to load exercises: ' + error.message);
            console.error('Failed to initialize:', error);
        }
    }
}

class WorkoutSettingTab extends PluginSettingTab {
    plugin: WorkoutGenPlugin;

    constructor(app: App, plugin: WorkoutGenPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        // TODO add rootFolder and exerciseListPath

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
