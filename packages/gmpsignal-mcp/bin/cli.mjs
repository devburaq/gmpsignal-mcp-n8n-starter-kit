#!/usr/bin/env node
/**
 * @file cli.mjs
 * @description Command-line launcher for the GMPSignal Model Context Protocol (MCP) Server.
 * Spawns @apify/actors-mcp-server preconfigured with GMPSignal intelligence suites or prints
 * ready-to-paste Claude Desktop / Cursor MCP configuration blocks.
 */

import { spawn } from 'node:child_process';
import { GMPSIGNAL_SUITES, resolveActorsForSuite, buildMcpServerConfig } from '../index.mjs';

/**
 * Parses command-line arguments passed to gmpsignal-mcp.
 *
 * @param {Array<string>} argv - Process argv slice.
 * @returns {{ suite: string, customActors: string, listOnly: boolean, printConfig: boolean }} Parsed CLI flags.
 */
function parseCliArgs(argv) {
    let suite = 'flagship';
    let customActors = '';
    let listOnly = false;
    let printConfig = false;

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--suite' && argv[i + 1]) {
            suite = argv[i + 1];
            i += 1;
        } else if (arg === '--actors' && argv[i + 1]) {
            customActors = argv[i + 1];
            i += 1;
        } else if (arg === '--list') {
            listOnly = true;
        } else if (arg === '--print-config') {
            printConfig = true;
        }
    }

    return { suite, customActors, listOnly, printConfig };
}

/**
 * Main CLI execution entry point.
 */
function main() {
    const { suite, customActors, listOnly, printConfig } = parseCliArgs(process.argv.slice(2));

    if (listOnly) {
        console.log('GMPSignal 40-Actor Intelligence Suites (https://apify.com/gmpsignal):');
        for (const [suiteKey, actorList] of Object.entries(GMPSIGNAL_SUITES)) {
            console.log(`\n[${suiteKey.toUpperCase()}] (${actorList.length} Actors):`);
            for (const slug of actorList) {
                console.log(`  - ${slug}`);
            }
        }
        return;
    }

    if (printConfig) {
        const configObj = buildMcpServerConfig(suite);
        console.log(JSON.stringify(configObj, null, 2));
        return;
    }

    const actorsArg = customActors
        ? customActors.trim()
        : resolveActorsForSuite(suite).join(',');

    const child = spawn(
        'npx',
        ['-y', '@apify/actors-mcp-server', '--actors', actorsArg],
        {
            stdio: 'inherit',
            env: {
                ...process.env
            }
        }
    );

    child.on('exit', (code) => {
        process.exitCode = code || 0;
    });
}

main();
