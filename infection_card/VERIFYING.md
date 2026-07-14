# Verification Rule

Do not paste long JavaScript into PowerShell with `node -e`.

PowerShell breaks easily on nested quotes, backslashes, Chinese text, EJS tags, and template strings. Use the checked-in verification script instead:

```powershell
node infection_card\verify_package.mjs
```

Run this after every `node infection_card\build_assets.mjs` and before saying the package is valid.

The script checks:

- required EJS and MVU update entries exist
- controlled event entries are disabled and have no key trigger
- schema includes `local_events`, `day_period`, `weather`, string inventory items, and `registerMvuSchema(Schema)`
- statusbar JavaScript parses
- statusbar displays weather and day/night but not phase gate
- embedded card has the same worldbook entry count and 7 regex scripts
