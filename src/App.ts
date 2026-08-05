export class App {
    private container: HTMLDivElement;
    private inputField: HTMLInputElement;
    private sendButton: HTMLButtonElement;
    private responseArea: HTMLDivElement;
    private activeContext: any = {};

    public render(): HTMLElement {
        this.container = document.createElement("div");
        this.container.className = "cortex-chat-container";
        this.container.style.cssText = "font-family: system-ui, -apple-system, sans-serif; padding: 12px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; background-color: #ffffff;";

        this.container.innerHTML = `
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #0284c7; display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 8px; height: 8px; background-color: #0284c7; border-radius: 50%;"></span>
                Snowflake Cortex Bridge
            </div>
            <div style="display: flex; gap: 6px; margin-bottom: 10px;">
                <input type="text" id="cortex-input" placeholder="Ask Cortex a question..." style="flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; outline: none;" />
                <button id="cortex-send" style="padding: 8px 14px; background-color: #0284c7; color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 12px; cursor: pointer; transition: background-color 0.2s;">Ask</button>
            </div>
            <div id="cortex-response" style="flex: 1; overflow-y: auto; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; font-size: 12px; background-color: #f8fafc;">
                <span style="color: #64748b;">Enter a prompt to query your Snowflake data model. Active Power BI dashboard filters will automatically be included.</span>
            </div>
        `;

        return this.container;
    }

    public initialize(): void {
        this.inputField = this.container.querySelector("#cortex-input") as HTMLInputElement;
        this.sendButton = this.container.querySelector("#cortex-send") as HTMLButtonElement;
        this.responseArea = this.container.querySelector("#cortex-response") as HTMLDivElement;

        this.sendButton.addEventListener("click", () => this.handleSend());
        this.inputField.addEventListener("keypress", (e: KeyboardEvent) => {
            if (e.key === "Enter") this.handleSend();
        });
    }

    // Called dynamically from visual.ts update() on every slicer/data update
    public updateContext(context: any): void {
        this.activeContext = context;
        console.log("App received updated Power BI Context:", this.activeContext);
    }

    private async handleSend(): Promise<void> {
        const question = this.inputField.value.trim();
        if (!question) return;

        this.responseArea.innerHTML = `<div style="color: #0284c7; font-weight: 500;"><strong>Thinking...</strong> Querying Cortex Analyst proxy with active dashboard context...</div>`;

        try {
            const response = await fetch("https://cortexbackend.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: question,
                    pbi_context: this.activeContext
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.renderResults(data);
        } catch (err: any) {
            this.responseArea.innerHTML = `<div style="color: #ef4444;"><strong>Error:</strong> ${err.message}</div>`;
        }
    }

    private renderResults(data: { answer: string; sql?: string; columns?: string[]; rows?: any[] }): void {
        // 1. Render Interpretation Text
        let html = `<div style="margin-bottom: 12px; line-height: 1.5; color: #1e293b;"><strong>Interpretation:</strong><br/>${data.answer.replace(/\n/g, '<br/>')}</div>`;

        // 2. Render Collapsible SQL
        if (data.sql) {
            html += `
                <details style="margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px; background-color: #ffffff;">
                    <summary style="cursor: pointer; color: #0284c7; font-weight: 600; font-size: 11px;">View Generated SQL Query</summary>
                    <pre style="background: #0f172a; color: #38bdf8; padding: 10px; font-size: 11px; border-radius: 4px; overflow-x: auto; margin-top: 6px; font-family: monospace;">${data.sql}</pre>
                </details>
            `;
        }

        // 3. Render HTML Data Table
        if (data.columns && data.columns.length > 0 && data.rows && data.rows.length > 0) {
            html += `
                <div style="overflow-x: auto; border: 1px solid #cbd5e1; border-radius: 4px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; background-color: #ffffff;">
                        <thead>
                            <tr style="background-color: #f1f5f9; color: #334155; font-weight: 600;">
                                ${data.columns.map(col => `<th style="padding: 8px; border-bottom: 1px solid #cbd5e1; border-right: 1px solid #e2e8f0;">${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.rows.map((row, idx) => `
                                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                                    ${data.columns.map(col => `<td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #f1f5f9; color: #0f172a;">${row[col] !== undefined ? row[col] : ''}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            html += `<div style="color: #64748b; margin-top: 6px;"><em>No result rows returned.</em></div>`;
        }

        this.responseArea.innerHTML = html;
    }
}