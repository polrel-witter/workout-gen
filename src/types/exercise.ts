export type ExerciseType = 'chrono' | 'quant';
export type MuscleGroup = Set<string>;

export interface ChronoDose {
    on?: number;  // seconds
    off?: number; // seconds
    total: number; // minutes
}

export interface QuantDose {
    rep: number; // quantity
    set: number; // quantity
    weight: number; // lbs
}

export interface Exercise {
    name: string;
    type: ExerciseType;
    muscleGroup: MuscleGroup;
    evolutionPrompts: string[];
}

export interface ExerciseInstance {
    exercise: Exercise;
    completed: boolean;
    dose: ChronoDose | QuantDose;
}

export interface ChronoPreviousState {
    time: number;   // seconds (total 'on' time)
}

export interface QuantPreviousState {
    weight: number; // lbs
    rep: number;    // total reps (rep * set)
}

export interface ProgressState {
    [exerciseName: string]: {
        chrono?: ChronoPreviousState;
        quant?: QuantPreviousState;
    }
}
