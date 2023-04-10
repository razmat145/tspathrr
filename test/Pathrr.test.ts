
import { describe, it, afterEach, jest, expect } from '@jest/globals';

import { promises as afs } from 'fs';
import path from 'path';

import { Pathrr } from '../src/index';


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

});