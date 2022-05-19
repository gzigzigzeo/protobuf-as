import { decorated } from "../proto";
import { Writer } from "./walker_as";
import { Options } from '../options';
import voca from "voca";

/**
 * OneOf code blocks
 */
export class OneOf {
    constructor(private p:Writer, private options:Options) {}

    public discriminatorDecl(desc: decorated.Message, group: string): void {
        const varName = OneOf.varName(this.options, desc.id, group);
        const indexVarName = OneOf.indexVarName(this.options, desc.id, group);

        this.p(`
            public ${varName}:string = "";
            public ${indexVarName}:u8 = 0;
        `)

    }

    public discriminatorConst(field: decorated.Field): void {
        if (!decorated.isOneOf(field)) {
            return
        }

        if (field.oneOf == undefined) {
            return
        }

        const name = voca.snakeCase(
            field.oneOf+" "+field.name.replace(/[.]+/g, "_") + " index"
        ).toUpperCase()

        this.p(`static readonly ${name}:u8 = ${field.number};`)
    }

    public static varName(options: Options, id: string, f: string): string {
        if (options.oneOfVarNames) {
            const path = id + "." + f
            const varName = options.oneOfVarNames.get(path)
            if (varName) {
                return varName
            }
        }

        return `__oneOf_${f}`;
    }

    public static indexVarName(options: Options, id: string, f: string): string {
        return OneOf.varName(options, id, f) + "_index";
    }
}