import { unlinkSync, PathLike, writeFile, mkdir } from 'fs';
export class Fs {
    unlinkSync(path: PathLike): any {
        return unlinkSync(path)
    }
    rename() { }
    stat() { }
    open() { }
    close() { }
    readFile() { }
    writeFile() { }
    mkdir() { }
}