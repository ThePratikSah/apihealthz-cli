#!/usr/bin/env node

import { Command } from "commander";
import { authCommand } from "./commands/auth";
import { add } from "./commands/add";
import { list } from "./commands/list";
import { del } from "./commands/delete";

const program = new Command();

program
  .name("apihealthz")
  .description("API uptime & health monitoring CLI")
  .version("1.0.0");

program.addCommand(authCommand);
program.command("add").description("Add a new API health check").action(add);
program.command("list").description("List all API health checks").action(list);
program.command("delete").description("Delete a health check").action(del);

program.parse(process.argv);
