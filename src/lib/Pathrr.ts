
import path from 'path';

import TsConfig from './TsConfig';


class Pathrr {

    public async resolve(filePaths: Array<string>, callerDir: string): Promise<Array<string>> {

        await TsConfig.read();

        const resolvedPaths = [];
        for (const file of filePaths) {
            resolvedPaths.push(this.resolvePath(path.join(callerDir, file)));
        }

        return resolvedPaths;
    }

    private resolvePath(filePath: string): string {
        return filePath.replace(
            TsConfig.getBuildPath(),
            TsConfig.getSourcePath()
        );
    }

}

export default new Pathrr();