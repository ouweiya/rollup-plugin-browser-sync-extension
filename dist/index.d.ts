import type { Plugin } from 'rollup';
import type { Options } from 'browser-sync';
type OptionsType = {
    options: Options;
    extReload?: boolean;
    extReloadOptions?: {
        port: number;
    };
};
declare const browserSyncPlugin: ({ options, extReload, extReloadOptions }: OptionsType) => Plugin;
export default browserSyncPlugin;
