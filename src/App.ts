export class App {
    private container: HTMLElement;
    private pbiContext: any = { categories: [] };

    constructor(container: HTMLElement) {
        this.container = container;
        this.renderBaseUI();
    }

    public setContext(context: any) {
        this.pbiContext = context;
    }

    private renderBaseUI() {
        this.container.innerHTML = `
            <style>
                .cortex-container {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #ffffff;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    color: #1e293b;
                    overflow: hidden;
                }
                .cortex-header {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #f1f5f9;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cortex-logo {
                    width: 32px;
                    height: 32px;
                    background-color: #0284c7;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }
                .header-title-container {
                    display: flex;
                    flex-direction: column;
                }
                .header-title {
                    font-weight: 700;
                    font-size: 14px;
                    color: #0f172a;
                    margin: 0;
                }
                .header-subtitle {
                    font-size: 11px;
                    color: #64748b;
                    margin: 0;
                }
                .status-badge {
                    background-color: #dcfce7;
                    color: #15803d;
                    font-size: 11px;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    background-color: #16a34a;
                    border-radius: 50%;
                }
                .context-section {
                    padding: 8px 16px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .context-title {
                    font-size: 9px;
                    font-weight: 700;
                    color: #64748b;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }
                .chips-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .chip {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 3px 8px;
                    font-size: 11px;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .chat-history {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .user-message {
                    align-self: flex-end;
                    background-color: #0256d0;
                    color: white;
                    padding: 10px 16px;
                    border-radius: 18px 18px 2px 18px;
                    font-size: 13px;
                    max-width: 85%;
                }
                .bot-message-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 6px;
                }
                .bot-avatar {
                    width: 20px;
                    height: 20px;
                    background-color: #0284c7;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 10px;
                }
                .bot-content {
                    font-size: 13px;
                    line-height: 1.5;
                    color: #334155;
                }
                .data-table-wrapper {
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin-top: 10px;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }
                .data-table th {
                    text-align: left;
                    padding: 8px 10px;
                    background-color: #f8fafc;
                    color: #64748b;
                    font-weight: 600;
                    border-bottom: 1px solid #e2e8f0;
                    text-transform: uppercase;
                    font-size: 10px;
                }
                .data-table td {
                    padding: 8px 10px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #1e293b;
                }
                .sql-accordion {
                    margin-top: 10px;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: #334155;
                    cursor: pointer;
                }
                .suggested-section {
                    padding: 8px 16px;
                }
                .suggested-title {
                    font-size: 9px;
                    font-weight: 700;
                    color: #64748b;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }
                .input-container {
                    padding: 8px 16px 12px 16px;
                    position: relative;
                }
                .input-box {
                    width: 100%;
                    padding: 10px 42px 10px 14px;
                    border: 1px solid #cbd5e1;
                    border-radius: 24px;
                    outline: none;
                    font-size: 12px;
                    box-sizing: border-box;
                }
                .send-btn {
                    position: absolute;
                    right: 22px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 28px;
                    height: 28px;
                    background-color: #0073ea;
                    border: none;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
            </style>

            <div class="cortex-container">
                <!-- Header -->
                <div class="cortex-header">
                    <div class="header-left">
                        <div class="cortex-logo">✦</div>
                        <div class="header-title-container">
                            <h3 class="header-title">Cortex Analyst</h3>
                            <p class="header-subtitle">Custom Power BI visual · context-aware</p>
                        </div>
                    </div>
                    <div class="status-badge">
                        <span class="status-dot"></span>
                        Connected
                    </div>
                </div>

                <!-- Active Context Pills -->
                <div class="context-section">
                    <div class="context-title">ASSISTANT HAS ACCESS TO</div>
                    <div class="chips-container">
                        <div class="chip"><span>Y</span> Current report filters</div>
                        <div class="chip"><span>✦</span> Selected visuals</div>
                        <div class="chip"><span>☵</span> Current page context</div>
                        <div class="chip"><span>⛁</span> Semantic model</div>
                        <div class="chip"><span>⛁</span> Snowflake Cortex Analyst</div>
                    </div>
                </div>

                <!-- Chat Scroll View -->
                <div class="chat-history" id="chatHistory">
                    <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
                        Ask a question to query Snowflake Cortex with your active slicer context.
                    </div>
                </div>

                <!-- Suggested Questions -->
                <div class="suggested-section">
                    <div class="suggested-title">SUGGESTED QUESTIONS</div>
                    <div class="chips-container" id="suggestedChips">
                        <div class="chip" style="cursor: pointer;">Top 10 brands</div>
                        <div class="chip" style="cursor: pointer;">Revenue by retailer</div>
                        <div class="chip" style="cursor: pointer;">Sales trend over time</div>
                        <div class="chip" style="cursor: pointer;">Which products are declining?</div>
                    </div>
                </div>

                <!-- Input Footer -->
                <div class="input-container">
                    <input type="text" id="cortexQueryInput" class="input-box" placeholder="Ask about this report..." />
                    <button id="cortexAskBtn" class="send-btn">➔</button>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    private attachEvents() {
        const askBtn = this.container.querySelector("#cortexAskBtn") as HTMLButtonElement;
        const queryInput = this.container.querySelector("#cortexQueryInput") as HTMLInputElement;

        const triggerQuery = () => {
            const queryText = queryInput.value.trim();
            if (queryText) {
                this.handleAskQuery(queryText);
                queryInput.value = "";
            }
        };

        askBtn.addEventListener("click", triggerQuery);
        queryInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") triggerQuery();
        });

        const suggestedChips = this.container.querySelectorAll("#suggestedChips .chip");
        suggestedChips.forEach(chip => {
            chip.addEventListener("click", () => {
                const text = chip.textContent || "";
                if (text) this.handleAskQuery(text);
            });
        });
    }

    private async handleAskQuery(queryText: string) {
        const chatHistory = this.container.querySelector("#chatHistory") as HTMLElement;

        // Clean initial placeholder
        if (chatHistory.querySelector("div[style*='text-align: center']")) {
            chatHistory.innerHTML = "";
        }

        // Add User Message Bubble
        const userBubble = document.createElement("div");
        userBubble.className = "user-message";
        userBubble.textContent = queryText;
        chatHistory.appendChild(userBubble);

        // Add Thinking Indicator
        const botBubble = document.createElement("div");
        botBubble.innerHTML = `
            <div class="bot-message-header">
                <div class="bot-avatar">✦</div>
                <span>Cortex Analyst</span>
            </div>
            <div class="bot-content" style="color: #0284c7;">Thinking...</div>
        `;
        chatHistory.appendChild(botBubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const response = await fetch("https://cortexbackend.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: queryText,
                    pbi_context: this.pbiContext
                })
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const data = await response.json();
            this.renderResponse(botBubble, data);
        } catch (error: any) {
            const contentDiv = botBubble.querySelector(".bot-content") as HTMLElement;
            contentDiv.style.color = "#dc2626";
            contentDiv.textContent = `Error: ${error.message}`;
        }
    }

    private renderResponse(botBubble: HTMLElement, data: any) {
        const chatHistory = this.container.querySelector("#chatHistory") as HTMLElement;

        let tableHtml = "";
        if (data.columns && data.rows && data.rows.length > 0) {
            const headers = data.columns.map((col: string) => `<th>${col}</th>`).join("");
            const rowsHtml = data.rows.map((row: any, idx: number) => {
                const cells = data.columns.map((col: string) => `<td>${row[col] !== undefined ? row[col] : ""}</td>`).join("");
                return `<tr><td style="color: #94a3b8; font-size: 10px;">${idx + 1}</td>${cells}</tr>`;
            }).join("");

            tableHtml = `
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>#</th>${headers}</tr></thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
            `;
        }

        const botContent = botBubble.querySelector(".bot-content") as HTMLElement;
        botContent.style.color = "#334155";
        botContent.innerHTML = `
            <div>${data.answer}</div>
            ${tableHtml}
            ${data.sql ? `
                <details class="sql-accordion">
                    <summary style="font-weight: 600; cursor: pointer;">› Generated SQL</summary>
                    <pre style="background: #1e293b; color: #f8fafc; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 11px; margin-top: 6px;"><code>${data.sql}</code></pre>
                </details>
            ` : ""}
            <div style="font-size: 11px; color: #64748b; margin-top: 8px; display: flex; align-items: center; gap: 4px;">
                <span>✦</span> Powered by Snowflake Cortex Analyst
            </div>
        `;

        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}