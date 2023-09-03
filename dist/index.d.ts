import type { Plugin } from 'rollup';
import type { Options } from 'browser-sync';
interface OptionsType {
    options: Options & {
        snippet?: boolean;
    };
    extReload?: false;
    extReloadOptions?: never;
}
interface OptionsTypeWithReload {
    options: Options & {
        snippet?: boolean;
    };
    extReload: true;
    extReloadOptions: {
        port: number;
    };
}
type OptionsTypeFinal = OptionsType | OptionsTypeWithReload;
declare const browserSyncPlugin: ({ options, extReload, extReloadOptions }: OptionsTypeFinal) => Plugin;
export default browserSyncPlugin;
