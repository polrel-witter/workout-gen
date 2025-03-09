import { FileService } from './FileService';
import { ExerciseModel } from '../models/Exercise';
import { WorkoutSettings } from '../types/settings';

export class ExerciseListService {
    private exercises: ExerciseModel[] = [];
    private fileService: FileService;

    constructor(private settings: WorkoutSettings) {
        this.fileService = new FileService(settings.rootFolder);
    }

    async loadExercises(): Promise<ExerciseModel[]> {
        try {
            const content = await this.fileService.readFile(this.settings.exerciseListPath);
            const lines = content.split('\n');

            this.exercises = [];
            let currentExercise: ExerciseModel | null = null;

            for (const line of lines) {
              if (line.trim().startsWith('- ')) {
                // New exercise definition
                if (currentExercise) {
                  this.exercises.push(currentExercise);
                }
                currentExercise = ExerciseModel.fromMarkdown(line.trim());
              } else if (line.trim().startsWith('    - ') && currentExercise) {
                // Evolution prompt
                const prompt = line.trim().substring(6); // Remove '    - '
                currentExercise.evolutionPrompts.push(prompt);
              }
            }

            if (currentExercise) {
              this.exercises.push(currentExercise);
            }

            return this.exercises;
        } catch (error) {
            throw new Error(`Failed to load exercise list: ${error.message}`);
        }
    }

    getExercises(): ExerciseModel[] {
        return this.exercises;
    }

    findExerciseByName(name: string): ExerciseModel | undefined {
        return this.exercises.find(ex => ex.name === name);
    }
}
