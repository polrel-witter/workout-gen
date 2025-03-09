import * as fs from 'fs/promises';
import * as path from 'path';

export class FileService {
    constructor(private readonly rootPath: string) {}

    async readFile(filePath: string): Promise<string> {
        try {
            const fullPath = path.join(this.rootPath, filePath);
            return await fs.readFile(fullPath, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error.message}`);
        }
    }

    async fileExists(filePath: string): Promise<boolean> {
          try {
              await fs.access(path.join(this.rootPath, filePath));
              return true;
          } catch {
              return false;
          }
    }
}
