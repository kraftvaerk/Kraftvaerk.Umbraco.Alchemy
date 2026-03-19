import { resolve, join, dirname } from 'path';
import { existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

// Tables that hold AI configuration (in dependency order).
// Parent tables must come before child tables to satisfy FK constraints.
const AI_CONFIG_TABLES = [
    'umbracoAIConnection',
    'umbracoAIProfile',
    'umbracoAIContext',
    'umbracoAIContextResource',
    'umbracoAIGuardrail',
    'umbracoAIGuardrailRule',
    'umbracoAISettings',
    'umbracoAIAgent',
    'umbracoAIPrompt',
];

export default function syncAI() {
    const __filename = fileURLToPath(import.meta.url);
    const frontendDir = dirname(__filename);
    const rootDir = resolve(frontendDir, '../../../');
    const umbracoRootDir = join(rootDir, 'Umbraco');

    if (!existsSync(umbracoRootDir)) {
        console.error(`Umbraco directory not found at "${umbracoRootDir}"`);
        process.exit(1);
    }

    // Discover all Umbraco instance folders and their DB paths
    const instances = readdirSync(umbracoRootDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name.toLowerCase().startsWith('umbraco-'))
        .map(d => {
            const folder = join(umbracoRootDir, d.name);
            const dbPath = join(folder, 'umbraco', 'Data', 'Umbraco.sqlite.db');
            return { name: d.name, folder, dbPath, hasDb: existsSync(dbPath) };
        });

    if (instances.length === 0) {
        console.error('No Umbraco instance folders found.');
        process.exit(1);
    }

    // Find the source: the instance with the most recently modified DB that has AI data
    const candidates = instances
        .filter(i => i.hasDb)
        .map(i => {
            const db = new Database(i.dbPath, { readonly: true });
            try {
                const tables = getAvailableAITables(db);
                const totalRows = tables.reduce((sum, t) => {
                    const row = db.prepare(`SELECT COUNT(*) as cnt FROM "${t}"`).get();
                    return sum + row.cnt;
                }, 0);
                return { ...i, tables, totalRows };
            } finally {
                db.close();
            }
        })
        .filter(i => i.totalRows > 0)
        .sort((a, b) => b.totalRows - a.totalRows);

    if (candidates.length === 0) {
        console.error('No Umbraco instances have AI configuration data to sync.');
        process.exit(1);
    }

    const source = candidates[0];
    const targets = instances.filter(i => i.name !== source.name);

    if (targets.length === 0) {
        console.log('Only one Umbraco instance found — nothing to sync to.');
        return;
    }

    console.log(`\n🔍 Source: ${source.name} (${source.totalRows} AI config rows across ${source.tables.length} tables)`);

    // Read all data from source
    const sourceDb = new Database(source.dbPath, { readonly: true });
    const sourceData = {};
    for (const table of source.tables) {
        sourceData[table] = sourceDb.prepare(`SELECT * FROM "${table}"`).all();
        if (sourceData[table].length > 0) {
            console.log(`   ${table}: ${sourceData[table].length} rows`);
        }
    }
    sourceDb.close();

    // Write to each target
    for (const target of targets) {
        console.log(`\n📋 Target: ${target.name}`);

        if (!target.hasDb) {
            console.log(`   ⏭️  Skipped — no database found (run the site first to create it)`);
            continue;
        }

        const targetDb = new Database(target.dbPath);
        const targetTables = getAvailableAITables(targetDb);

        try {
            targetDb.pragma('journal_mode = WAL');
            const transaction = targetDb.transaction(() => {
                // Clear existing AI config in reverse order (child tables first)
                for (const table of [...targetTables].reverse()) {
                    if (sourceData[table]) {
                        const deleted = targetDb.prepare(`DELETE FROM "${table}"`).run();
                        if (deleted.changes > 0) {
                            console.log(`   🗑️  Cleared ${deleted.changes} rows from ${table}`);
                        }
                    }
                }

                // Insert in forward order (parent tables first)
                for (const table of AI_CONFIG_TABLES) {
                    const rows = sourceData[table];
                    if (!rows || rows.length === 0 || !targetTables.includes(table)) continue;

                    const columns = Object.keys(rows[0]);
                    const placeholders = columns.map(() => '?').join(', ');
                    const quotedCols = columns.map(c => `"${c}"`).join(', ');
                    const stmt = targetDb.prepare(
                        `INSERT OR REPLACE INTO "${table}" (${quotedCols}) VALUES (${placeholders})`
                    );

                    for (const row of rows) {
                        stmt.run(...columns.map(c => row[c]));
                    }
                    console.log(`   ✅ Inserted ${rows.length} rows into ${table}`);
                }
            });

            transaction();
        } finally {
            targetDb.close();
        }
    }

    console.log('\n✨ AI configuration synced across all Umbraco instances.\n');
}

function getAvailableAITables(db) {
    const existing = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'umbracoAI%' ORDER BY name"
    ).all().map(r => r.name);

    // Return only config tables that exist in this DB, in dependency order
    return AI_CONFIG_TABLES.filter(t => existing.includes(t));
}
