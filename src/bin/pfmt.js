#!/usr/bin/env node

import "babel-polyfill";
import yargs from "yargs";

import * as analyse from "../commands/analyse";
import * as measure from "../commands/measure";
import * as stress from "../commands/stress";

yargs
    .help("help")
    .wrap(100)
    .usage("Usage: $0 <command> [options]")
    .command("analyse", "Analyse measurements", analyse)
    .command("measure", "Run measurement scenarios", measure)
    .command("stress", "Run stress scenarios", stress)
    .parse(process.argv);
