/**
 * Configurable logger class used by azu-js; optionally uses Winston.
 * Logging levels for "normal" code events vs "errors/exceptions"
 * can be configured.
 * Chris Joakim, Microsoft, 2023
 */

import os from "os";
import util from "util";
import { Logger } from "winston";

export class AzuLogger {
    
    public static LOG_LEVELS = {
        silent: 10,
        error:   5,
        warn:    4,
        info:    3,
        debug:   2
    };

    errorLogged : number = 0;
    warnLogged  : number = 0;
    infoLogged  : number = 0;
    debugLogged : number = 0;

    /**
     * The Winston Logger arg is optional, but will be used if populated.
     * Otherwise, level-based console.log statements will be used.
     */
    constructor(
        public name: string,
        public normalLevel:    number = AzuLogger.LOG_LEVELS.warn,
        public exceptionLevel: number = AzuLogger.LOG_LEVELS.info,
        public winstonLogger?: Logger) {
    }

    error(message : string) {
        if (this.winstonLogger) {
            this.winstonLogger.error(message);
        }
        else {
            if (this.normalLevel <= AzuLogger.LOG_LEVELS.error) {
                this.errorLogged++;
                console.log(util.format('azu-js %s error: %s', this.name, message));
            }
        }
    }

    warn(message : string) {
        if (this.winstonLogger) {
            this.winstonLogger.warn(message);
        }
        else {
            if (this.normalLevel <= AzuLogger.LOG_LEVELS.warn) {
                this.warnLogged++;
                console.log(util.format('azu-js %s warn: %s', this.name, message));
            }
        }
    }

    info(message : string) {
        if (this.winstonLogger) {
            this.winstonLogger.info(message);
        }
        else {
            if (this.normalLevel <= AzuLogger.LOG_LEVELS.info) {
                this.infoLogged++;
                console.log(util.format('azu-js %s info: %s', this.name, message));
            }
        }
    }

    debug(message : string) {
        if (this.winstonLogger) {
            this.winstonLogger.debug(message);
        }
        else {
            if (this.normalLevel <= AzuLogger.LOG_LEVELS.debug) {
                this.debugLogged++;
                console.log(util.format('azu-js %s debug: %s', this.name, message));
            }
        }
    }

    // Exception logging methods

    errorException(excp: any) {
        if (this.winstonLogger) {
            this.winstonLogger.error(excp);
        }
        else {
            if (this.exceptionLevel <= AzuLogger.LOG_LEVELS.error) {
                this.errorLogged++;
                console.log(util.format('azu-js %s error: %s', this.name, excp));
            }
        }
    }

    warnException(excp: any) {
        if (this.winstonLogger) {
            this.winstonLogger.warn(excp);
        }
        else {
            if (this.exceptionLevel <= AzuLogger.LOG_LEVELS.warn) {
                this.warnLogged++;
                console.log(util.format('azu-js %s warn: %s', this.name, excp));
            }
        }
    }

    infoException(excp: any) {
        if (this.winstonLogger) {
            this.winstonLogger.info(excp);
        }
        else {
            if (this.exceptionLevel <= AzuLogger.LOG_LEVELS.info) {
                this.infoLogged++;
                console.log(util.format('azu-js %s info: %s', this.name, excp));
            }
        }
    }

    debugException(excp: any) {
        if (this.winstonLogger) {
            this.winstonLogger.debug(excp);
        }
        else {
            if (this.exceptionLevel <= AzuLogger.LOG_LEVELS.debug) {
                this.debugLogged++;
                console.log(util.format('azu-js %s debug: %s', this.name, excp));
            }
        }
    }

    stats() : object {
        let obj = {};
        obj['name'] = this.name;
        obj['errorLogged'] = this.errorLogged;
        obj['warnLogged']  = this.warnLogged;
        obj['infoLogged']  = this.infoLogged;
        obj['debugLogged'] = this.debugLogged;
        obj['winston'] = this.winstonLogger != null;
        return obj;    
    }
}
