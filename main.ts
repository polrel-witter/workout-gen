import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { VIEW_TYPE_WORKOUT, WorkoutView } from './WorkoutView';

interface WorkoutGenSettings {
  	mySetting: string;
}

const DEFAULT_SETTINGS: WorkoutGenSettings = {
  	mySetting: 'default'
}

export default class WorkoutGenPlugin extends Plugin {
    settings: WorkoutGenSettings;

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

    onunload() {
        console.log('unloading workout-gen plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
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
