
import { promises as afs } from 'fs';
import path from 'path';

interface ITsOpts {
    compilerOptions?: {
        rootDir?: string;

        outDir?: string;
    }
}

class TsConfig {

    private cwd = process.cwd();

    private commentsRegex = /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g;

    private buildPath: string;

    private sourcePath: string;

    private loadedConfig: string;

    public async read(reuse = false) {
        const tsConfig = await this.getConfigFile(reuse);

        this.applyPaths(this.stripParse(tsConfig));
    }

    public getBuildPath() {
        return this.buildPath;
    }

    private async getConfigFile(reuse = false) {
        if (reuse) {
            if (this.loadedConfig) {
                return this.loadedConfig;
            } else {
                this.loadedConfig = await this.loadConfigFile();
                return this.loadedConfig;
            }
        } else {
            return this.loadConfigFile();
        }
    }

    private async loadConfigFile() {
        const tsConfigPath = path.normalize(path.join(this.cwd, 'tsconfig.json'));

        let tsConfig;
        try {
            tsConfig = await afs.readFile(tsConfigPath, 'utf-8');
        } catch (err) {
            throw new Error(`Error while reading base tsconfig at path: ${tsConfigPath}; with message: ${err.message}`);
        }
        return tsConfig;
    }

    public getSourcePath() {
        return this.sourcePath;
    }

    private stripParse(json: string) {
        let parsedContents;
        try {
            parsedContents = JSON.parse(json.replace(this.commentsRegex, (match, offset) => offset ? "" : match));
        } catch (err) {
            throw new Error(`Error while parsing tsconfing; with message: ${err.message}`);
        }
        return parsedContents;
    }

    private applyPaths(opts: ITsOpts) {
        const { rootDir, outDir } = opts?.compilerOptions;

        this.buildPath = outDir ? path.join(this.cwd, outDir) : this.cwd;
        this.sourcePath = rootDir ? path.join(this.cwd, rootDir) : this.cwd;
    }

}

export default new TsConfig();