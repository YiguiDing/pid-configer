import { Terminal } from "xterm";
import { WebglAddon } from "xterm-addon-webgl";
import { FitAddon } from "xterm-addon-fit";

export class XTerminal {
  term: Terminal;
  isWebglEnabled = false;
  constructor(dom: HTMLDivElement) {
    this.term = new Terminal({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: vscodeSnazzyTheme,
      cursorBlink: true,
      allowProposedApi: true,
    });
    this.term.open(dom);
    try {
      const webgl = new WebglAddon();
      this.term.loadAddon(webgl);
      this.isWebglEnabled = true;
    } catch (e) {
      console.warn("WebGL addon threw an exception during load", e);
    }
    try {
      const fitAddon = new FitAddon();
      this.term.loadAddon(fitAddon);
      window.addEventListener("resize", () => {
        fitAddon.fit();
      });
    } catch (e) {
      console.warn("Fit addon threw an exception during load", e);
    }
    let xtermDOM = document.querySelector(".xterm")!;
    if (xtermDOM) {
      // Cancel wheel events from scrolling the page if the terminal has scrollback
      xtermDOM.addEventListener("wheel", (e) => {
        if (this.term.buffer.active.baseY > 0) {
          e.preventDefault();
        }
      });
    }
    this.runFakeTerminal();
  }
  command = "";
  prompt(newLine = true) {
    if (newLine) this.term.write("\r\n$ ");
    else this.term.write("$ ");
    this.command = "";
  }
  commands = {
    help: {
      exec: (args: string[]) => {
        const padding = 10;
        const formatMessage = (name, description) => {
          const maxLength = this.term.cols - padding - 3;
          let remaining = description;
          const d: any[] = [];
          while (remaining.length > 0) {
            // Trim any spaces left over from the previous line
            remaining = remaining.trimStart();
            // Check if the remaining text fits
            if (remaining.length < maxLength) {
              d.push(remaining);
              remaining = "";
            } else {
              let splitIndex = -1;
              // Check if the remaining line wraps already
              if (remaining[maxLength] === " ") {
                splitIndex = maxLength;
              } else {
                // Find the last space to use as the split index
                for (let i = maxLength - 1; i >= 0; i--) {
                  if (remaining[i] === " ") {
                    splitIndex = i;
                    break;
                  }
                }
              }
              d.push(remaining.substring(0, splitIndex));
              remaining = remaining.substring(splitIndex);
            }
          }
          const message =
            `  \x1b[36;1m${name.padEnd(padding)}\x1b[0m ${d[0]}` +
            d.slice(1).map((e) => `\r\n  ${" ".repeat(padding)} ${e}`);
          return message;
        };
        this.term.writeln(
          [
            "command:",
            "",
            ...Object.keys(this.commands).map((e) =>
              formatMessage(e, this.commands[e].description)
            ),
          ] //
            .join("\n\r")
        );
      },
      description: "Prints this help message",
    },
    clear: {
      exec: (args: string[]) => {
        this.term.clear();
      },
      description: "clear screen",
    },
    "*": {
      exec: (args: string[]) => {
        // default
        this.term.writeln(`${args[0]}: command not found`);
      },
      description: "process message",
    },
  };
  runCommand(text: string) {
    const args = text.trim().split(" ");
    const command = args[0];
    if (command.length > 0) {
      this.term.writeln("");
      if (command in this.commands) {
        this.commands[command].exec(args);
      } else {
        this.commands["*"].exec(args);
      }
    }
  }
  initialized = false;
  runFakeTerminal() {
    if (this.initialized) return;
    this.initialized = true;
    this.prompt(false);
    this.term.onSelectionChange(() => {
      console.log(this.term.hasSelection());
    });
    this.term.onKey((event) => {
      switch (event.key) {
        // ctrl + v 粘贴
        case "\x16":
          navigator.clipboard.readText().then((text: string) => {
            this.command += text;
            this.term.write(text);
          });
          break;
        // ctrl + c
        case "\x03":
          // 复制
          if (this.term.hasSelection()) {
            navigator.clipboard.writeText(this.term.getSelection());
          } else {
            // 退出
            this.term.write("^C");
            this.prompt();
          }
          break;
        case "\u007F": // Backspace (DEL)
          // Do not delete the prompt
          // @ts-ignore
          if (this.term._core.buffer.x > 2) {
            this.term.write("\b \b");
            if (this.command.length > 0) {
              this.command = this.command.substr(0, this.command.length - 1);
            }
          }
          break;
        case "\r": // Enter
          this.runCommand(this.command);
          this.prompt();
          this.command = "";
          break;
      }
    });
    this.term.onData((ch) => {
      switch (ch) {
        default:
          // Print all other characters for demo
          if (
            (ch >= String.fromCharCode(0x20) &&
              ch <= String.fromCharCode(0x7e)) ||
            ch >= "\u00a0"
          ) {
            this.command += ch;
            this.term.write(ch);
          }
          break;
      }
    });
  }
}
// Custom theme
var baseTheme = {
  foreground: "#F8F8F8",
  background: "#2D2E2C",
  selection: "#5DA5D533",
  black: "#1E1E1D",
  brightBlack: "#262625",
  red: "#CE5C5C",
  brightRed: "#FF7272",
  green: "#5BCC5B",
  brightGreen: "#72FF72",
  yellow: "#CCCC5B",
  brightYellow: "#FFFF72",
  blue: "#5D5DD3",
  brightBlue: "#7279FF",
  magenta: "#BC5ED1",
  brightMagenta: "#E572FF",
  cyan: "#5DA5D5",
  brightCyan: "#72F0FF",
  white: "#F8F8F8",
  brightWhite: "#FFFFFF",
};
// vscode-snazzy https://github.com/Tyriar/vscode-snazzy
var vscodeSnazzyTheme = {
  foreground: "#eff0eb",
  background: "#282a36",
  selection: "#97979b33",
  black: "#282a36",
  brightBlack: "#686868",
  red: "#ff5c57",
  brightRed: "#ff5c57",
  green: "#5af78e",
  brightGreen: "#5af78e",
  yellow: "#f3f99d",
  brightYellow: "#f3f99d",
  blue: "#57c7ff",
  brightBlue: "#57c7ff",
  magenta: "#ff6ac1",
  brightMagenta: "#ff6ac1",
  cyan: "#9aedfe",
  brightCyan: "#9aedfe",
  white: "#f1f1f0",
  brightWhite: "#eff0eb",
};
