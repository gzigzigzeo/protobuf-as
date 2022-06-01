import { decorated } from '../proto/index.js';
import { Writer } from './index.js';
import { relativeName, comment } from './internal.js';
import { Options } from '../options';
import { normalize, join, dirname, parse } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync } from 'fs';

/**
 * Message code blocks
 */
export class Message {
    private ext:Map<string, string> = new Map<string, string>();

    constructor(private p: Writer, private options: Options) {
        if (!options.stdext) {
            return
        }

        const extPath = normalize(join(dirname(fileURLToPath(import.meta.url)), "../../assembly/ext"))
        const exts = readdirSync(extPath)
        
        exts.forEach(f => this.ext.set(parse(f).name, readFileSync(join(extPath, f)).toString()))
    }

    start(message: decorated.Message) {
        this.p(comment(message))
        this.p(`export class ${relativeName(message.relativeName)} {`);
    }

    finish(message: decorated.Message) {
        if (this.ext.has(message.id)) {
            this.p(this.ext.get(message.id) as string)
        }

        this.p(`
        } // ${relativeName(message.relativeName)}
        `);
    }
}
