// Unit tests for class Logger
// Chris Joakim, Microsoft, 2023

// npm test --testPathPattern AzuLogger

import util from "util";
import winston from "winston";
//import { createLogger, transports, format, Logger } from "winston";

import { AzuLogger } from "./AzuLogger";
import { FileUtil } from "./FileUtil";

test("AzuLogger: default", async () => {
    let logger : AzuLogger = new AzuLogger('Test');
    logger.error('error()');
    logger.warn('warn()');
    logger.info('info()');
    logger.debug('debug()');

    logger.errorException('errorException()');
    logger.warnException('warnException()');
    logger.infoException('infoException()');
    logger.debugException('debugException()');
    //console.log(logger.stats());
    // {
    //     name: 'Test',
    //     errorLogged: 2,
    //     warnLogged: 2,
    //     infoLogged: 1,
    //     debugLogged: 0
    // }
    expect(logger.errorLogged).toBe(2);
    expect(logger.warnLogged).toBe(2);
    expect(logger.infoLogged).toBe(1);
    expect(logger.debugLogged).toBe(0);
    expect(logger.winstonLogger).toBeUndefined();
});

test("AzuLogger: silent", async () => {
    let logger : AzuLogger = new AzuLogger(
        'Test', AzuLogger.LOG_LEVELS.silent, AzuLogger.LOG_LEVELS.silent);
    logger.error('error()');
    logger.warn('warn()');
    logger.info('info()');
    logger.debug('debug()');

    logger.errorException('errorException()');
    logger.warnException('warnException()');
    logger.infoException('infoException()');
    logger.debugException('debugException()');
    //console.log(logger.stats());
    // {
    //     name: 'Test',
    //     errorLogged: 0,
    //     warnLogged: 0,
    //     infoLogged: 0,
    //     debugLogged: 0
    //   }
    expect(logger.errorLogged).toBe(0);
    expect(logger.warnLogged).toBe(0);
    expect(logger.infoLogged).toBe(0);
    expect(logger.debugLogged).toBe(0);
    expect(logger.winstonLogger).toBeUndefined();
});


test("AzuLogger: winston", async () => {
    let winstonLogger = winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.Console()
            ]});

    let logger : AzuLogger = new AzuLogger(
        'Test', AzuLogger.LOG_LEVELS.silent, AzuLogger.LOG_LEVELS.silent, winstonLogger);
    logger.error('error()');
    logger.warn('warn()');
    logger.info('info()');
    logger.debug('debug()');

    logger.errorException('errorException()');
    logger.warnException('warnException()');
    logger.infoException('infoException()');
    logger.debugException('debugException()');
    //console.log(logger.stats());
    // {
    //     name: 'Test',
    //     errorLogged: 0,
    //     warnLogged: 0,
    //     infoLogged: 0,
    //     debugLogged: 0
    //   }
    expect(logger.errorLogged).toBe(0);
    expect(logger.warnLogged).toBe(0);
    expect(logger.infoLogged).toBe(0);
    expect(logger.debugLogged).toBe(0);
    expect(logger.winstonLogger).toBeTruthy();
});
