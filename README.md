# APIHealthz CLI

A command-line tool to monitor your API and website uptime and health. Keep track of your services' availability, receive alerts when they go down, and manage all your health checks from the terminal.

## Features

- 🔐 **OAuth Authentication** - Secure login with Google
- 📊 **Health Monitoring** - Monitor any API or website endpoint
- ⏱️ **Flexible Intervals** - Choose from 5 minutes, 15 minutes, 30 minutes, or 1 hour check intervals
- 🔔 **Multiple Alert Channels** - Get notified via Slack, Email, or WhatsApp when your services go down
- 📋 **Easy Management** - List, add, and delete health checks with simple commands
- 🎯 **Interactive Setup** - User-friendly prompts guide you through configuration

## Installation

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/ThePratikSah/apihealthz-cli.git
cd apihealthz-cli
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Link the CLI globally:

```bash
npm link
```

After linking, you can use the `apihealthz` command from anywhere in your terminal.

## Usage

### Authentication

Before you can use the CLI, you need to authenticate:

```bash
# Login with Google
apihealthz auth login --provider google

# Check your authentication status
apihealthz auth status

# Logout
apihealthz auth logout
```

### Adding a Health Check

Add a new API or website to monitor:

```bash
apihealthz add
```

The interactive prompt will guide you through:

- **URL**: The API or website endpoint to monitor (must start with `http://` or `https://`)
- **Check Interval**: Choose how often to check (5 min, 15 min, 30 min, or 1 hour)
- **Alert Configuration**: Set up notifications via Slack, Email, WhatsApp, or skip alerts

**Example:**

```
API URL to monitor: https://api.example.com/health
Select check interval: Every 5 minutes
How do you want to receive alerts?: Slack
Slack webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Listing Health Checks

View all your configured health checks:

```bash
apihealthz list
```

This displays a table with:

- Health check ID
- Monitored URL
- Check interval
- Last status (UP ✅ or DOWN ❌)
- Last checked timestamp

### Deleting a Health Check

Remove a health check:

```bash
apihealthz delete
```

You'll be prompted to enter the health check ID and confirm deletion.

## Commands Reference

| Command                                     | Description                              |
| ------------------------------------------- | ---------------------------------------- |
| `apihealthz auth login [--provider google]` | Authenticate with ApiHealthz             |
| `apihealthz auth logout`                    | Logout from ApiHealthz                   |
| `apihealthz auth status`                    | Show current authentication status       |
| `apihealthz add`                            | Add a new API health check (interactive) |
| `apihealthz list`                           | List all configured health checks        |
| `apihealthz delete`                         | Delete a health check (interactive)      |
| `apihealthz --version`                      | Show version number                      |
| `apihealthz --help`                         | Show help message                        |

## Alert Configuration

### Slack Alerts

To receive Slack notifications, you'll need a Slack webhook URL:

1. Go to your Slack workspace settings
2. Create a new incoming webhook
3. Copy the webhook URL (format: `https://hooks.slack.com/services/...`)
4. Provide it when adding a health check

### Email Alerts

Simply provide your email address when configuring alerts. You'll receive email notifications when your monitored endpoints go down.

### WhatsApp Alerts

WhatsApp alerts are configured during the health check setup process.

## Development

### Project Structure

```
apihealthz-cli/
├── src/
│   ├── commands/      # CLI command implementations
│   ├── services/      # API and business logic
│   └── utils/         # Utility functions (config, etc.)
├── dist/              # Compiled JavaScript output
└── package.json
```

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Development Setup

```bash
npm run setup
```

This builds the project and links it globally in one command.

## Requirements

- Node.js 14+
- An ApiHealthz account (created during first login)

## License

ISC

## Support

For issues, questions, or contributions, please open an issue on the repository.
