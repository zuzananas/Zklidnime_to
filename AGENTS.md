# Playwright MCP (this repo)

## Local preview URL

When driving the site with Playwright MCP, use this base URL so paths and assets match a normal HTTP server:

**http://127.0.0.1:5500/**

Start your static server on that host and port first (for example VS Code Live Server’s default). Do not rely on `file://` for full-site checks unless you are only testing a single file in isolation.

## Generated files

Save screenshots, traces, downloads, and any other MCP-generated artifacts under:

**`.playwright-mcp/`**

That directory is listed in `.gitignore` so generated content stays local.
