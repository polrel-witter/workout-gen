import { Exercise, ExerciseType, MuscleGroup } from '../types/exercise';
import { ChronoDose, QuantDose } from '../types/exercise';

export class ExerciseModel implements Exercise {
    constructor(
        public name: string,
        public type: ExerciseType,
        public muscleGroup: MuscleGroup,
        public evolutionPrompts: string[] = []
    ) {}

    static fromMarkdown(line: string): ExerciseModel {
      // Parse line like "- exercise (chrono) #muscleGroup #muscleGroup2"
	    const match = line.match(/^- ([^(]+)\s*\((\w+)\)\s*#([\w\s#]+)/);
	    if (!match) {
	      throw new Error(`Invalid exercise format: ${line}`);
	    }

	    const [_, name, type, groupStr] = match;

	    if (type !== 'chrono' && type !== 'quant') {
	      throw new Error(`Invalid exercise type: ${type}`);
	    }

	    // Split multiple muscle groups and clean up
	    const groups = groupStr.split('#')
	        .map(g => g.trim())
	        .filter(g => g.length > 0);

      const groupsAsSet = new Set(groups);

	    return new ExerciseModel(
	      name.trim(),
	      type as ExerciseType,
	      groupsAsSet as MuscleGroup
	    );
	  }

    calculateBenchmark(dose: ChronoDose | QuantDose): number {
        if (this.type === 'chrono') {
          const d = dose as ChronoDose;
          return (d.on || 60) * d.total;
        } else {
            const d = dose as QuantDose;
          return d.rep * d.set * (d.weight || 1);
        }
    }
}
