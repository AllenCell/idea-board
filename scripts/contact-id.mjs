#!/usr/bin/env node
/**
 * Mint a contactId for a new allenite and (optionally) write the stub .md.
 *
 * The contactId is the first 8 hex chars of sha256(name.lower().trim()).
 * Same scheme as every existing allenite — keep it consistent so the
 * Google Sheet and the allenite frontmatter agree.
 *
 * Usage:
 *   node scripts/contact-id.mjs "Person Name"          # print hash only
 *   node scripts/contact-id.mjs "Person Name" --write  # also write the .md
 *
 * --write creates src/pages/allenite/<slug>.md with templateKey/name/contactId
 * if it doesn't exist. If it exists, no changes are made (edit by hand to
 * preserve any custom frontmatter like position/program).
 *
 * After running, paste the printed id into col A of the contacts sheet,
 * alongside the person's name/email/github fields.
 */

import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const name = args.filter((a) => a !== "--write").join(" ").trim();

if (!name) {
    console.error('Usage: node scripts/contact-id.mjs "Person Name" [--write]');
    process.exit(2);
}

const id = createHash("sha256").update(name.toLowerCase()).digest("hex").slice(0, 8);
console.log(id);

if (write) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const path = join("src/pages/allenite", `${slug}.md`);
    if (existsSync(path)) {
        console.error(`# ${path} already exists — left untouched`);
    } else {
        writeFileSync(
            path,
            `---\ntemplateKey: allenite\nname: ${name}\ncontactId: ${id}\n---\n`,
        );
        console.error(`# wrote ${path}`);
    }
}
