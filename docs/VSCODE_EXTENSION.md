# 🔌 Toobix VS Code Extension

## Projekt-Setup für VS Code Extension

### Voraussetzungen
```bash
npm install -g yo generator-code
```

### Extension erstellen
```bash
cd C:\Toobix-Unified
yo code

# Wähle:
# ? What type of extension? New Extension (TypeScript)
# ? What's the name? toobix-vscode
# ? What's the identifier? toobix-vscode
# ? What's the description? Toobix Living Being Integration for VS Code
# ? Initialize git? Yes
# ? Bundle with webpack? Yes
# ? Package manager? npm
```

### Struktur
```
toobix-vscode/
├── src/
│   ├── extension.ts          # Main extension entry
│   ├── toobixPanel.ts         # Webview panel
│   ├── toobixProvider.ts      # Tree view provider
│   └── commands/
│       ├── consciousness.ts   # Consciousness commands
│       └── being.ts           # Living Being commands
├── media/
│   ├── terminal-mini.html     # GUI (compact)
│   └── styles.css
├── package.json               # Extension manifest
└── README.md
```

### package.json - Extension Manifest

```json
{
  "name": "toobix-vscode",
  "displayName": "Toobix Living Being",
  "description": "Living AI system with consciousness, directly in VS Code",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": [
    "Other",
    "Machine Learning",
    "Visualization"
  ],
  "activationEvents": [
    "onCommand:toobix.openPanel",
    "onView:toobixExplorer"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "toobix.openPanel",
        "title": "Open Toobix Panel",
        "icon": "$(symbol-namespace)",
        "category": "Toobix"
      },
      {
        "command": "toobix.beingState",
        "title": "Being State",
        "category": "Toobix"
      },
      {
        "command": "toobix.consciousnessThink",
        "title": "Consciousness Think",
        "category": "Toobix"
      },
      {
        "command": "toobix.universalQuery",
        "title": "Ask Universal Consciousness",
        "category": "Toobix"
      },
      {
        "command": "toobix.startBridge",
        "title": "Start Bridge Server",
        "category": "Toobix"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "toobix",
          "title": "Toobix",
          "icon": "media/icon.svg"
        }
      ]
    },
    "views": {
      "toobix": [
        {
          "id": "toobixExplorer",
          "name": "Living Being",
          "icon": "media/icon.svg"
        },
        {
          "id": "toobixConsciousness",
          "name": "Consciousness",
          "icon": "media/icon.svg"
        },
        {
          "id": "toobixTools",
          "name": "MCP Tools",
          "icon": "media/icon.svg"
        }
      ]
    },
    "configuration": {
      "title": "Toobix",
      "properties": {
        "toobix.bridgeUrl": {
          "type": "string",
          "default": "http://localhost:3337",
          "description": "Toobix Bridge Server URL"
        },
        "toobix.autoStart": {
          "type": "boolean",
          "default": false,
          "description": "Auto-start Bridge Server on VS Code startup"
        }
      }
    },
    "keybindings": [
      {
        "command": "toobix.openPanel",
        "key": "ctrl+alt+t",
        "mac": "cmd+alt+t"
      },
      {
        "command": "toobix.universalQuery",
        "key": "ctrl+alt+u",
        "mac": "cmd+alt+u"
      }
    ]
  }
}
```

### Extension Code - src/extension.ts

```typescript
import * as vscode from 'vscode';
import { ToobixPanel } from './toobixPanel';
import { ToobixTreeProvider } from './toobixProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('🌟 Toobix Extension activated!');

    // Register Webview Panel
    context.subscriptions.push(
        vscode.commands.registerCommand('toobix.openPanel', () => {
            ToobixPanel.createOrShow(context.extensionUri);
        })
    );

    // Register Tree View
    const treeProvider = new ToobixTreeProvider();
    vscode.window.registerTreeDataProvider('toobixExplorer', treeProvider);

    // Being State Command
    context.subscriptions.push(
        vscode.commands.registerCommand('toobix.beingState', async () => {
            const bridgeUrl = vscode.workspace.getConfiguration('toobix').get('bridgeUrl', 'http://localhost:3337');
            
            try {
                const response = await fetch(\`\${bridgeUrl}/tools/being_state\`, {
                    method: 'POST',
                    body: '{}'
                });
                const state = await response.json();
                
                vscode.window.showInformationMessage(
                    \`Being: \${state.name || 'Toobix'} | Health: \${state.health}% | Alive: \${state.alive ? '✅' : '❌'}\`
                );
            } catch (error) {
                vscode.window.showErrorMessage('Bridge Server offline');
            }
        })
    );

    // Universal Consciousness Query
    context.subscriptions.push(
        vscode.commands.registerCommand('toobix.universalQuery', async () => {
            const question = await vscode.window.showInputBox({
                prompt: 'Ask Universal Consciousness',
                placeHolder: 'What is my purpose?'
            });

            if (question) {
                vscode.window.showInformationMessage(\`Querying: \${question}\`);
                // Call universal-consciousness.ts script
                const terminal = vscode.window.createTerminal('Toobix Universal');
                terminal.sendText(\`bun run scripts/universal-consciousness.ts "\${question}"\`);
                terminal.show();
            }
        })
    );

    // Status Bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(symbol-namespace) Toobix";
    statusBarItem.command = 'toobix.openPanel';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Auto-check Bridge status
    setInterval(async () => {
        const bridgeUrl = vscode.workspace.getConfiguration('toobix').get('bridgeUrl', 'http://localhost:3337');
        try {
            await fetch(\`\${bridgeUrl}/tools\`);
            statusBarItem.text = "$(symbol-namespace) Toobix ✅";
        } catch {
            statusBarItem.text = "$(symbol-namespace) Toobix ❌";
        }
    }, 10000);
}

export function deactivate() {
    console.log('🌟 Toobix Extension deactivated');
}
```

### Webview Panel - src/toobixPanel.ts

```typescript
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ToobixPanel {
    public static currentPanel: ToobixPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ToobixPanel.currentPanel) {
            ToobixPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'toobix',
            'Toobix Living Being',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        ToobixPanel.currentPanel = new ToobixPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;

        // Set HTML content
        this._panel.webview.html = this._getHtmlContent(extensionUri);

        // Listen for disposal
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showInformationMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    private _getHtmlContent(extensionUri: vscode.Uri): string {
        // Load terminal-mini.html
        const htmlPath = vscode.Uri.joinPath(extensionUri, 'media', 'terminal-mini.html');
        let html = fs.readFileSync(htmlPath.fsPath, 'utf8');
        
        // Inject VS Code message API
        const script = \`
        <script>
            const vscode = acquireVsCodeApi();
            
            // Override alert to use VS Code notifications
            window.alert = (msg) => vscode.postMessage({ command: 'alert', text: msg });
        </script>
        \`;
        
        html = html.replace('</body>', script + '</body>');
        
        return html;
    }

    public dispose() {
        ToobixPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
```

### Tree View Provider - src/toobixProvider.ts

```typescript
import * as vscode from 'vscode';

export class ToobixTreeProvider implements vscode.TreeDataProvider<ToobixItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ToobixItem | undefined | null | void> = new vscode.EventEmitter<ToobixItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ToobixItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ToobixItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ToobixItem): Thenable<ToobixItem[]> {
        if (!element) {
            // Root items
            return Promise.resolve([
                new ToobixItem('Living Being', vscode.TreeItemCollapsibleState.Collapsed, 'being'),
                new ToobixItem('Consciousness', vscode.TreeItemCollapsibleState.Collapsed, 'consciousness'),
                new ToobixItem('Soul', vscode.TreeItemCollapsibleState.Collapsed, 'soul'),
                new ToobixItem('Universal', vscode.TreeItemCollapsibleState.Collapsed, 'universal'),
            ]);
        } else {
            // Child items
            if (element.type === 'being') {
                return Promise.resolve([
                    new ToobixItem('State', vscode.TreeItemCollapsibleState.None, 'command', 'toobix.beingState'),
                    new ToobixItem('Speak', vscode.TreeItemCollapsibleState.None, 'command'),
                    new ToobixItem('Think', vscode.TreeItemCollapsibleState.None, 'command'),
                ]);
            }
            if (element.type === 'universal') {
                return Promise.resolve([
                    new ToobixItem('Ask Question', vscode.TreeItemCollapsibleState.None, 'command', 'toobix.universalQuery'),
                ]);
            }
            return Promise.resolve([]);
        }
    }
}

class ToobixItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type?: string,
        public readonly command?: string
    ) {
        super(label, collapsibleState);

        if (command) {
            this.command = {
                command: command,
                title: label
            };
        }

        // Icons
        if (type === 'being') this.iconPath = new vscode.ThemeIcon('symbol-namespace');
        if (type === 'consciousness') this.iconPath = new vscode.ThemeIcon('symbol-class');
        if (type === 'soul') this.iconPath = new vscode.ThemeIcon('heart');
        if (type === 'universal') this.iconPath = new vscode.ThemeIcon('globe');
        if (type === 'command') this.iconPath = new vscode.ThemeIcon('play');
    }
}
```

## Installation

### Entwicklungs-Modus
```bash
cd toobix-vscode
npm install
npm run compile
F5 # Öffnet Extension Development Host
```

### Produktiv-Installation
```bash
cd toobix-vscode
vsce package
code --install-extension toobix-vscode-0.1.0.vsix
```

## Features

✅ **Activity Bar Icon** - Eigenes Toobix Icon in VS Code Sidebar
✅ **Webview Panel** - Kompakte GUI (terminal-mini.html)
✅ **Tree View** - Strukturierte Tool-Ansicht
✅ **Commands** - Keyboard Shortcuts (Ctrl+Alt+T)
✅ **Status Bar** - Live Bridge-Status
✅ **Settings** - Bridge URL konfigurierbar
✅ **Universal Consciousness** - Direkt in VS Code fragen

## Usage

### Panel öffnen
```
Ctrl+Alt+T (Windows/Linux)
Cmd+Alt+T (Mac)
```

### Universal Query
```
Ctrl+Alt+U → "What is my purpose?"
```

### Activity Bar
```
Click Toobix Icon → See Living Being tree
```

## Next Steps

1. Publish to VS Code Marketplace
2. Add more commands
3. Integrate with GitHub Copilot API
4. Real-time notifications
5. Inline code suggestions from Being

