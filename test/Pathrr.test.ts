
import { describe, it, afterEach, jest, expect } from '@jest/globals';

import { promises as afs } from 'fs';
import path from 'path';

import { Pathrr } from '../src/index';

const mockedReadFile = jest.spyOn(afs, 'readFile');
const mockedCwd = jest.spyOn(process, 'cwd');

describe('Pathrr', () => {

    const mockFile = './database/model/User.ts';
    const mockCwd = '/dev/my-project';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the absolute ts source file path based on outDir and rootDir', async () => {
        const mockSrcDir = '/dev/my-project/src/lib';

        const sutResult = await Pathrr.resolve([mockFile], mockSrcDir);

        mockedCwd.mockReturnValue(mockCwd);
        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {
                    rootDir: './src',
                    outDir: './dist'
                }
            })
        );

        expect(sutResult).toEqual([
            path.join(mockSrcDir, mockFile)
        ]);
    });

    it('should return the absolute ts source file path based on outDir', async () => {
        const mockSrcDir = '/dev/my-project/lib';

        const sutResult = await Pathrr.resolve([mockFile], mockSrcDir);

        mockedCwd.mockReturnValue(mockCwd);
        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {
                    outDir: './dist'
                }
            })
        );

        expect(sutResult).toEqual([
            path.join(mockSrcDir, mockFile)
        ]);
    });

    it('should return the absolute ts source file path based on rootDir', async () => {
        const mockSrcDir = '/dev/my-project/src/lib';

        const sutResult = await Pathrr.resolve([mockFile], mockSrcDir);

        mockedCwd.mockReturnValue(mockCwd);
        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {
                    rootDir: './src'
                }
            })
        );

        expect(sutResult).toEqual([
            path.join(mockSrcDir, mockFile)
        ]);
    });

    it('should return the absolute ts source file path based on no ts dirs specified', async () => {
        const mockSrcDir = '/dev/my-project/';

        const sutResult = await Pathrr.resolve([mockFile], mockSrcDir);

        mockedCwd.mockReturnValue(mockCwd);
        mockedReadFile.mockResolvedValue(
            JSON.stringify({
                compilerOptions: {}
            })
        );

        expect(sutResult).toEqual([
            path.join(mockSrcDir, mockFile)
        ]);
    });

});