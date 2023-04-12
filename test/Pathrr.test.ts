
import { describe, it, afterEach, jest, expect } from '@jest/globals';

import { promises as afs } from 'fs';
import path from 'path';

import { Pathrr } from '../src/index';
import TsConfig from '../src/lib/TsConfig';


const mockedReadFile = jest.spyOn(afs, 'readFile');

describe('Pathrr', () => {

    const mockFile = './database/model/User.ts';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the absolute ts source file path based on outDir and rootDir', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/dist/lib');
        const mockActualSrcCallerDir = path.join(process.cwd(), '/src/lib');

        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {
                    rootDir: './src',
                    outDir: './dist'
                }
            })
        );

        const sutResult = await Pathrr.resolve([mockFile], mockDistCallerDir);

        expect(mockedReadFile).toHaveBeenCalled();

        expect(sutResult).toEqual([
            path.join(mockActualSrcCallerDir, mockFile)
        ]);
    });

    it('should return the absolute ts source file path based on outDir', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/dist/lib');
        const mockActualSrcCallerDir = path.join(process.cwd(), '/lib');

        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {
                    outDir: './dist'
                }
            })
        );

        const sutResult = await Pathrr.resolve([mockFile], mockDistCallerDir);

        expect(mockedReadFile).toHaveBeenCalled();

        expect(sutResult).toEqual([
            path.join(mockActualSrcCallerDir, mockFile)
        ]);
    });

    it('should return the absolute ts source file path based on rootDir', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/lib');
        const mockActualSrcCallerDir = path.join(process.cwd(), '/src/lib');

        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {
                    rootDir: './src'
                }
            })
        );

        const sutResult = await Pathrr.resolve([mockFile], mockDistCallerDir);

        expect(mockedReadFile).toHaveBeenCalled();

        expect(sutResult).toEqual([
            path.join(mockActualSrcCallerDir, mockFile)
        ]);
    });

    it('should return the absolute ts source file path based on no ts dirs specified', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/lib');

        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {}
            })
        );

        const sutResult = await Pathrr.resolve([mockFile], mockDistCallerDir);

        expect(mockedReadFile).toHaveBeenCalled();

        expect(sutResult).toEqual([
            path.join(mockDistCallerDir, mockFile)
        ]);
    });

    it('should read the tsconfig twice if reuse flag is passed', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/lib');

        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {}
            })
        );

        await Pathrr.resolve([mockFile], mockDistCallerDir, true);

        expect(mockedReadFile).toHaveBeenCalledTimes(1);

        await Pathrr.resolve([mockFile], mockDistCallerDir, true);

        expect(mockedReadFile).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when passed in json is invalid', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/lib');

        mockedReadFile.mockResolvedValue(
            ` invalid JSON,  /// what
            I should be soo invalid;!-= maybe`
        );

        await expect(Pathrr.resolve([mockFile], mockDistCallerDir))
            .rejects
            .toThrow(`Error while parsing tsconfing; with message: Unexpected token i in JSON at position 1`);
    });

    it('should throw an error when the file path is invalid', async () => {
        const mockDistCallerDir = path.join(process.cwd(), '/lib');
        const fakeInvalidCwd = 'var/some/path';

        TsConfig['cwd'] = fakeInvalidCwd;
        mockedReadFile.mockRestore();

        await expect(Pathrr.resolve([mockFile], mockDistCallerDir))
            .rejects
            .toThrow(`Error while reading base tsconfig at path: ${path.normalize(path.join(fakeInvalidCwd, 'tsconfig.json'))}; with message: ENOENT: no such file or directory, open '${path.normalize(path.join(process.cwd(), fakeInvalidCwd, 'tsconfig.json'))}'`);

        TsConfig['cwd'] = process.cwd();
    });

});