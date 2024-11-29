#!/usr/bin/env node
import {program} from "commander";
import executeDay from "./executeDay";

program
	.command("executeDay <day> [part]")
	.action(executeDay);

program.parseAsync().catch(console.log);