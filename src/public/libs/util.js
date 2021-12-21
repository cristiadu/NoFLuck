import { statSync, mkdirSync } from 'fs';

/**
 * Make directory if it doesn't exist already.
 *
 * @param {String} path The path to the directory.
 */
export function mkdir(path) {
    try {
        statSync(path);
    } catch (e) {
        if (e.code === 'ENOENT') {
            mkdirSync(path);
        }
    }
}