// Unit tests for class Logger
// Chris Joakim, Microsoft, 2023

// npm test --testPathPattern AppLogger

import winston from "winston";

import { AppLogger } from "./AppLogger";

test("AppLogger: default", async () => {
    let logger : AppLogger = AppLogger.buildDefaultLogger('Default');
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

test("AppLogger: exceptions only", async () => {
    let logger : AppLogger = AppLogger.buildDefaultExceptionsOnlyLogger("ExcpOnly");
    logger.error('error()');
    logger.warn('warn()');
    logger.info('info()');
    logger.debug('debug()');

    logger.errorException('errorException()');
    logger.warnException('warnException()');
    logger.infoException('infoException()');
    logger.debugException('debugException()');

    logger.errorException('errorException()');
    logger.warnException('warnException()');
    logger.infoException('infoException()');
    logger.debugException('debugException()');

    expect(logger.errorLogged).toBe(2);
    expect(logger.warnLogged).toBe(2);
    expect(logger.infoLogged).toBe(2);
    expect(logger.debugLogged).toBe(0);
    expect(logger.winstonLogger).toBeUndefined();
});

test("AppLogger: silent", async () => {
    let logger : AppLogger = AppLogger.buildSilentLogger('Silent');
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

test("AppLogger: verbose", async () => {
    let logger : AppLogger = AppLogger.buildVerboseLogger('Verbose');
    logger.error('error()');
    logger.warn('warn()');
    logger.info('info()');
    logger.debug('debug()');

    logger.errorException('errorException()');
    logger.warnException('warnException()');
    logger.infoException('infoException()');
    logger.debugException('debugException()');
    console.log(logger.stats());
    // {
    //     name: 'Test',
    //     errorLogged: 0,
    //     warnLogged: 0,
    //     infoLogged: 0,
    //     debugLogged: 0
    //   }
    expect(logger.errorLogged).toBe(2);
    expect(logger.warnLogged).toBe(2);
    expect(logger.infoLogged).toBe(2);
    expect(logger.debugLogged).toBe(2);
    expect(logger.winstonLogger).toBeUndefined();
});

test("AppLogger: winston", async () => {
    let winstonLogger = winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.Console()
            ]});

    let logger : AppLogger = new AppLogger(
        'Winston', AppLogger.LOG_LEVELS.silent, AppLogger.LOG_LEVELS.silent, winstonLogger);
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
