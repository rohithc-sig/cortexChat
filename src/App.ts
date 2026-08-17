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

                /* ==============================
                   DEBUG REQUEST SECTION
                   ============================== */

                .request-debug-section {
                    margin: 6px 12px;
                    border: 1px solid #60a5fa;
                    background-color: #eff6ff;
                    border-radius: 6px;
                    padding: 6px 8px;
                    box-sizing: border-box;
                    flex-shrink: 0;
                }

                .request-debug-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 4px;
                }

                .request-debug-summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    cursor: pointer;
                    list-style: none;
                }

                .request-debug-summary::-webkit-details-marker {
                    display: none;
                }

                .request-debug-title {
                    font-size: 9px;
                    font-weight: 700;
                    color: #1d4ed8;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                .copy-request-btn {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    border: 1px solid #2563eb;
                    background-color: #ffffff;
                    color: #1d4ed8;
                    border-radius: 4px;
                    padding: 4px 10px;
                    font-size: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    min-width: 55px;
                    height: 24px;
                    z-index: 9999;
                }

                .copy-request-btn:hover {
                    background-color: #dbeafe;
                }

                .copy-request-btn.copied {
                    color: #15803d;
                    border-color: #86efac;
                    background-color: #f0fdf4;
                }

                .request-debug-content {
                    margin: 0;
                    color: #1e40af;
                    font-family: Consolas, "Courier New", monospace;
                    font-size: 9px;
                    line-height: 1.3;
                    white-space: pre-wrap;
                    word-break: break-word;
                    max-height: 100px;
                    overflow-y: auto;
                }

                /* ==============================
                   CHAT
                   ============================== */

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

                /* ==============================
                   DOWNLOAD CSV BUTTON
                   ============================== */

                .download-csv-btn,
                .copy-csv-btn,
                .copy-sql-btn {
                    margin-top: 8px;
                    border: 1px solid #cbd5e1;
                    background-color: #ffffff;
                    color: #334155;
                    border-radius: 6px;
                    padding: 6px 10px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .download-csv-btn:hover,
                .copy-csv-btn:hover,
                .copy-sql-btn:hover {
                    background-color: #f8fafc;
                }

                .download-csv-btn:active,
                .copy-csv-btn:active,
                .copy-sql-btn:active {
                    background-color: #e2e8f0;
                }

                .copy-csv-btn {
                    margin-left: 8px;
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

                        <div class="cortex-logo">
                            ✦
                        </div>

                        <div class="header-title-container">

                            <h3 class="header-title">
                                Cortex Analyst
                            </h3>

                            <p class="header-subtitle">
                                Custom Power BI visual · context-aware
                            </p>

                        </div>

                    </div>

                    <div class="status-badge">

                        <span class="status-dot"></span>

                        Connected

                    </div>

                </div>


                <!-- Active Context Pills -->
                <div class="context-section">

                    <div class="context-title">
                        ASSISTANT HAS ACCESS TO
                    </div>

                    <div class="chips-container">

                        <div class="chip">
                            <span>Y</span>
                            Current report filters
                        </div>

                        <div class="chip">
                            <span>✦</span>
                            Selected visuals
                        </div>

                        <div class="chip">
                            <span>☵</span>
                            Current page context
                        </div>

                        <div class="chip">
                            <span>⛁</span>
                            Semantic model
                        </div>

                        <div class="chip">
                            <span>⛁</span>
                            Snowflake Cortex Analyst
                        </div>

                    </div>

                </div>


                <!-- DEBUG REQUEST -->

                <details
                    class="request-debug-section"
                    open
                >

                    <summary class="request-debug-summary">

                        <div class="request-debug-title">
                            REQUEST SENT BY POWER BI
                        </div>

                        <button
                            id="copyRequestBtn"
                            class="copy-request-btn"
                            type="button"
                        >
                            Copy
                        </button>

                    </summary>

                    <pre
                        id="requestDebugContent"
                        class="request-debug-content"
                    >{
  "question": "",
  "pbi_context": {
    "categories": []
  }
}</pre>

                </details>


                <!-- Chat Scroll View -->

                <div
                    class="chat-history"
                    id="chatHistory"
                >

                    <div
                        style="
                            text-align: center;
                            color: #94a3b8;
                            font-size: 12px;
                            margin-top: 20px;
                        "
                    >
                        Ask a question to query Snowflake Cortex
                        with your active slicer context.
                    </div>

                </div>


                <!-- Suggested Questions -->

                <div class="suggested-section">

                    <div class="suggested-title">
                        SUGGESTED QUESTIONS
                    </div>

                    <div
                        class="chips-container"
                        id="suggestedChips"
                    >

                        <div
                            class="chip"
                            style="cursor: pointer;"
                        >
                            Top 10 brands
                        </div>

                        <div
                            class="chip"
                            style="cursor: pointer;"
                        >
                            Revenue by retailer
                        </div>

                        <div
                            class="chip"
                            style="cursor: pointer;"
                        >
                            Sales trend over time
                        </div>

                        <div
                            class="chip"
                            style="cursor: pointer;"
                        >
                            Which products are declining?
                        </div>

                    </div>

                </div>


                <!-- Input Footer -->

                <div class="input-container">

                    <input
                        type="text"
                        id="cortexQueryInput"
                        class="input-box"
                        placeholder="Ask about this report..."
                    />

                    <button
                        id="cortexAskBtn"
                        class="send-btn"
                        type="button"
                    >
                        ➔
                    </button>

                </div>

            </div>
        `;

        this.attachEvents();
    }


    private attachEvents() {

        const askBtn =
            this.container.querySelector(
                "#cortexAskBtn"
            ) as HTMLButtonElement;

        const queryInput =
            this.container.querySelector(
                "#cortexQueryInput"
            ) as HTMLInputElement;


        /* ==============================
           ASK QUERY
           ============================== */

        const triggerQuery = () => {

            const queryText =
                queryInput.value.trim();

            if (queryText) {

                this.handleAskQuery(
                    queryText
                );

                queryInput.value = "";
            }
        };


        askBtn.addEventListener(
            "click",
            triggerQuery
        );


        queryInput.addEventListener(
            "keypress",
            (e) => {

                if (e.key === "Enter") {

                    triggerQuery();

                }

            }
        );


        /* ==============================
           SUGGESTED QUESTIONS
           ============================== */

        const suggestedChips =
            this.container.querySelectorAll(
                "#suggestedChips .chip"
            );


        suggestedChips.forEach(
            chip => {

                chip.addEventListener(
                    "click",
                    () => {

                        const text =
                            chip.textContent || "";

                        if (text) {

                            this.handleAskQuery(
                                text
                            );

                        }

                    }
                );

            }
        );


        /* ==============================
           COPY DEBUG REQUEST
           ============================== */

        const copyRequestBtn =
            this.container.querySelector(
                "#copyRequestBtn"
            ) as HTMLButtonElement;


        if (copyRequestBtn) {

            copyRequestBtn.addEventListener(
                "click",
                async (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    const requestDebugContent =
                        this.container.querySelector(
                            "#requestDebugContent"
                        ) as HTMLElement;


                    if (!requestDebugContent) {
                        return;
                    }


                    const textToCopy =
                        requestDebugContent.textContent || "";

                    const copied =
                        await this.copyTextToClipboard(
                            textToCopy
                        );

                    if (copied) {

                        copyRequestBtn.textContent =
                            "Copied!";

                        copyRequestBtn.classList.add(
                            "copied"
                        );

                        setTimeout(
                            () => {

                                copyRequestBtn.textContent =
                                    "Copy";

                                copyRequestBtn.classList.remove(
                                    "copied"
                                );

                            },
                            1500
                        );

                    }

                }
            );

        }


        /* ==============================
           CSV DOWNLOAD
           ==============================

           IMPORTANT:
           The CSV button is created dynamically
           after the backend responds.

           Therefore, we attach ONE click listener
           to the main visual container instead of
           attaching a listener directly to the
           dynamically-created button.
        */

        this.container.addEventListener(
            "click",
            async (event) => {

                const target =
                    event.target as HTMLElement;


                const downloadButton =
                    target.closest(
                        '[data-action="download-csv"]'
                    ) as HTMLButtonElement;


                if (downloadButton) {

                    event.preventDefault();
                    event.stopPropagation();

                    const botContent =
                        downloadButton.closest(
                            ".bot-content"
                        ) as HTMLElement;

                    if (!botContent) {
                        console.error(
                            "Could not find bot content"
                        );
                        return;
                    }

                    const csvData =
                        (botContent as any).__csvData;

                    if (
                        !csvData ||
                        !csvData.columns ||
                        !csvData.rows
                    ) {
                        console.error(
                            "CSV data not found"
                        );
                        return;
                    }

                    const originalButtonText =
                        downloadButton.textContent ||
                        "Download CSV";

                    downloadButton.disabled = true;
                    downloadButton.textContent =
                        "Downloading...";

                    try {
                        this.downloadCsv(
                            csvData.columns,
                            csvData.rows
                        );
                    } finally {
                        setTimeout(
                            () => {
                                downloadButton.disabled = false;
                                downloadButton.textContent =
                                    originalButtonText;
                            },
                            1200
                        );
                    }

                    return;
                }


                const copyCsvButton =
                    target.closest(
                        '[data-action="copy-csv"]'
                    ) as HTMLButtonElement;


                if (copyCsvButton) {

                    event.preventDefault();
                    event.stopPropagation();

                    const botContent =
                        copyCsvButton.closest(
                            ".bot-content"
                        ) as HTMLElement;

                    if (!botContent) {
                        console.error(
                            "Could not find bot content"
                        );
                        return;
                    }

                    const csvData =
                        (botContent as any).__csvData;

                    const csvText =
                        csvData && csvData.csvText
                            ? csvData.csvText
                            : this.buildCsvContent(
                                  csvData?.columns || [],
                                  csvData?.rows || []
                              );

                    const originalButtonText =
                        copyCsvButton.textContent ||
                        "Copy CSV";

                    copyCsvButton.disabled = true;
                    copyCsvButton.textContent =
                        "Copying...";

                    const copied =
                        await this.copyTextToClipboard(
                            csvText
                        );

                    copyCsvButton.disabled = false;
                    copyCsvButton.textContent =
                        copied ? "Copied!" : originalButtonText;

                    setTimeout(
                        () => {
                            copyCsvButton.textContent =
                                originalButtonText;
                        },
                        1200
                    );

                    return;
                }


                const copySqlButton =
                    target.closest(
                        '[data-action="copy-sql"]'
                    ) as HTMLButtonElement;


                if (copySqlButton) {

                    event.preventDefault();
                    event.stopPropagation();

                    const botContent =
                        copySqlButton.closest(
                            ".bot-content"
                        ) as HTMLElement;

                    if (!botContent) {
                        console.error(
                            "Could not find bot content"
                        );
                        return;
                    }

                    const sqlText =
                        (botContent as any).__sqlText || "";

                    const originalButtonText =
                        copySqlButton.textContent ||
                        "Copy SQL";

                    copySqlButton.disabled = true;
                    copySqlButton.textContent =
                        "Copying...";

                    const copied =
                        await this.copyTextToClipboard(
                            sqlText
                        );

                    copySqlButton.disabled = false;
                    copySqlButton.textContent =
                        copied ? "Copied!" : originalButtonText;

                    setTimeout(
                        () => {
                            copySqlButton.textContent =
                                originalButtonText;
                        },
                        1200
                    );

                }

            }
        );

    }


    private async handleAskQuery(
        queryText: string
    ) {

        const chatHistory =
            this.container.querySelector(
                "#chatHistory"
            ) as HTMLElement;


        /*
         * Create the exact payload that will
         * be sent to the backend.
         *
         * This SAME object is:
         *
         * 1. Displayed in the blue debug section
         * 2. Sent to the backend
         */

        const requestPayload = {

            question: queryText,

            pbi_context: this.pbiContext

        };


        /* ==============================
           UPDATE DEBUG SECTION
           ============================== */

        const requestDebugContent =
            this.container.querySelector(
                "#requestDebugContent"
            ) as HTMLElement;


        if (requestDebugContent) {

            requestDebugContent.textContent =
                JSON.stringify(
                    requestPayload,
                    null,
                    2
                );

        }


        /* ==============================
           CLEAN INITIAL PLACEHOLDER
           ============================== */

        const initialPlaceholder =
            chatHistory.querySelector(
                "div[style*='text-align: center']"
            );


        if (initialPlaceholder) {

            initialPlaceholder.remove();

        }


        /* ==============================
           USER MESSAGE
           ============================== */

        const userBubble =
            document.createElement(
                "div"
            );


        userBubble.className =
            "user-message";


        userBubble.textContent =
            queryText;


        chatHistory.appendChild(
            userBubble
        );


        /* ==============================
           THINKING INDICATOR
           ============================== */

        const botBubble =
            document.createElement(
                "div"
            );


        botBubble.innerHTML = `

            <div class="bot-message-header">

                <div class="bot-avatar">
                    ✦
                </div>

                <span>
                    Cortex Analyst
                </span>

            </div>

            <div
                class="bot-content"
                style="color: #0284c7;"
            >
                Thinking...
            </div>

        `;


        chatHistory.appendChild(
            botBubble
        );


        chatHistory.scrollTop =
            chatHistory.scrollHeight;


        /* ==============================
           BACKEND REQUEST
           ============================== */

        try {

            const response =
                await fetch(
                    "https://cortexbackend.onrender.com/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        /*
                         * This is the exact same
                         * requestPayload displayed
                         * in the debug section.
                         */

                        body:
                            JSON.stringify(
                                requestPayload
                            )
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    `Server returned ${response.status}: ${errorText}`
                );

            }


            const data =
                await response.json();


            this.renderResponse(
                botBubble,
                data
            );


        } catch (error: any) {

            const contentDiv =
                botBubble.querySelector(
                    ".bot-content"
                ) as HTMLElement;


            if (contentDiv) {

                contentDiv.style.color =
                    "#dc2626";


                contentDiv.textContent =
                    `Error: ${error.message}`;

            }

        }

    }


    private renderResponse(
        botBubble: HTMLElement,
        data: any
    ) {

        const chatHistory =
            this.container.querySelector(
                "#chatHistory"
            ) as HTMLElement;


        let tableHtml = "";


        /* ==============================
           DATA TABLE
           ============================== */

        if (
            data.columns &&
            data.rows &&
            data.rows.length > 0
        ) {

            const headers =
                data.columns
                    .map(
                        (col: string) =>
                            `<th>${this.escapeHtml(col)}</th>`
                    )
                    .join("");


            const rowsHtml =
                data.rows
                    .map(
                        (
                            row: any,
                            idx: number
                        ) => {

                            const cells =
                                data.columns
                                    .map(
                                        (col: string) =>
                                            `<td>${
                                                row[col] !== undefined &&
                                                row[col] !== null
                                                    ? this.escapeHtml(
                                                          String(row[col])
                                                      )
                                                    : ""
                                            }</td>`
                                    )
                                    .join("");


                            return `
                                <tr>

                                    <td
                                        style="
                                            color: #94a3b8;
                                            font-size: 10px;
                                        "
                                    >
                                        ${idx + 1}
                                    </td>

                                    ${cells}

                                </tr>
                            `;

                        }
                    )
                    .join("");


            tableHtml = `

                <div class="data-table-wrapper">

                    <table class="data-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                ${headers}

                            </tr>

                        </thead>

                        <tbody>

                            ${rowsHtml}

                        </tbody>

                    </table>

                </div>

                <div>

                    <button
                        class="download-csv-btn"
                        data-action="download-csv"
                        type="button"
                    >
                        ↓ Download CSV
                    </button>

                    <button
                        class="copy-csv-btn"
                        data-action="copy-csv"
                        type="button"
                    >
                        Copy CSV
                    </button>

                </div>

            `;

        }


        /* ==============================
           RESPONSE
           ============================== */

        const botContent =
            botBubble.querySelector(
                ".bot-content"
            ) as HTMLElement;


        if (!botContent) {
            return;
        }


        /*
         * Store the backend data directly on
         * this particular bot response.
         *
         * The dynamically-created CSV button
         * retrieves this data when clicked.
         */

        const csvText =
            this.buildCsvContent(
                data.columns || [],
                data.rows || []
            );

        (botContent as any).__csvData = {

            columns:
                data.columns || [],

            rows:
                data.rows || [],

            csvText

        };

        (botContent as any).__sqlText =
            data.sql || "";


        botContent.style.color =
            "#334155";


        botContent.innerHTML = `

            <div>
                ${data.answer || ""}
            </div>

            ${tableHtml}

            ${
                data.sql
                    ? `

                        <details
                            class="sql-accordion"
                        >

                            <summary
                                style="
                                    font-weight: 600;
                                    cursor: pointer;
                                "
                            >
                                › Generated SQL
                            </summary>

                            <div
                                style="
                                    display: flex;
                                    justify-content: flex-end;
                                    margin-top: 8px;
                                "
                            >
                                <button
                                    class="copy-sql-btn"
                                    data-action="copy-sql"
                                    type="button"
                                >
                                    Copy SQL
                                </button>
                            </div>

                            <pre
                                style="
                                    background: #1e293b;
                                    color: #f8fafc;
                                    padding: 10px;
                                    border-radius: 6px;
                                    overflow-x: auto;
                                    font-size: 11px;
                                    margin-top: 6px;
                                "
                            >

                                <code>
                                    ${this.escapeHtml(
                                        data.sql
                                    )}
                                </code>

                            </pre>

                        </details>

                    `
                    : ""
            }

            <div
                style="
                    font-size: 11px;
                    color: #64748b;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                "
            >

                <span>
                    ✦
                </span>

                Powered by Snowflake Cortex Analyst

            </div>

        `;


        chatHistory.scrollTop =
            chatHistory.scrollHeight;

    }


    private buildCsvContent(
        columns: string[],
        rows: any[]
    ): string {

        const csvRows: string[] = [];

        csvRows.push(
            columns
                .map(
                    column =>
                        this.escapeCsvValue(
                            String(column)
                        )
                )
                .join(",")
        );

        rows.forEach(
            (row: any) => {

                const values =
                    columns.map(
                        (column: string) => {

                            const value =
                                row[column] !== undefined &&
                                row[column] !== null
                                    ? row[column]
                                    : "";

                            return this.escapeCsvValue(
                                String(value)
                            );

                        }
                    );

                csvRows.push(
                    values.join(",")
                );

            }
        );

        return "\uFEFF" + csvRows.join("\r\n");
    }


    private async copyTextToClipboard(
        text: string
    ): Promise<boolean> {

        try {

            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText === "function"
            ) {

                try {

                    await navigator.clipboard.writeText(
                        text
                    );

                    return true;

                } catch (clipboardError) {

                    console.warn(
                        "Clipboard API failed, using fallback:",
                        clipboardError
                    );

                }

            }


            const textArea =
                document.createElement(
                    "textarea"
                );

            textArea.value =
                text;

            textArea.setAttribute(
                "readonly",
                ""
            );

            textArea.style.position =
                "fixed";

            textArea.style.left =
                "-9999px";

            textArea.style.top =
                "-9999px";

            textArea.style.opacity =
                "0";

            document.body.appendChild(
                textArea
            );

            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(
                0,
                textArea.value.length
            );

            let copied = false;

            try {

                copied =
                    document.execCommand(
                        "copy"
                    );

            } catch (execError) {

                console.warn(
                    "execCommand copy failed:",
                    execError
                );

            }

            document.body.removeChild(
                textArea
            );

            return copied;

        } catch (error) {

            console.error(
                "Clipboard copy failed:",
                error
            );

            return false;

        }

    }


    /* ==============================
       DOWNLOAD CSV
       ============================== */

    private downloadCsv(
        columns: string[],
        rows: any[]
    ) {

        try {

            console.log(
                "Starting CSV download..."
            );

            const csvContent =
                this.buildCsvContent(
                    columns,
                    rows
                );

            console.log(
                "CSV generated successfully"
            );


            /*
             * Create Blob
             */

            const blob =
                new Blob(
                    [csvContent],
                    {
                        type:
                            "text/csv;charset=utf-8"
                    }
                );


            /*
             * Create temporary URL
             */

            const url =
                URL.createObjectURL(
                    blob
                );


            /*
             * Create temporary anchor.
             * In Power BI / embedded hosts the anchor must be attached
             * to the live document body, not just the visual container,
             * otherwise the browser can suppress the download.
             */

            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            const fileName =
                `cortex_analyst_result_${this.getTimestamp()}.csv`;

            link.download =
                fileName;

            link.setAttribute(
                "download",
                fileName
            );

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";

            link.style.position =
                "fixed";

            link.style.left =
                "-9999px";

            link.style.top =
                "-9999px";

            link.style.opacity =
                "0";


            const hostRoot =
                document.body || document.documentElement;

            hostRoot.appendChild(
                link
            );


            /*
             * Trigger download using both click methods to maximize
             * compatibility in embedded browser contexts.
             */

            /*
             * Use the browser-managed save flow. Some Power BI hosts
             * wait longer than 1s to complete the save, so the blob URL
             * must remain alive long enough for the download to finish.
             */

            if (window.open) {

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }

            link.click();

            link.dispatchEvent(
                new MouseEvent(
                    "click",
                    {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }
                )
            );


            /*
             * Cleanup after a slightly longer delay so the browser can
             * complete the save operation before the blob URL is revoked.
             */

            setTimeout(
                () => {

                    if (link.parentNode) {

                        link.parentNode.removeChild(
                            link
                        );

                    }

                    URL.revokeObjectURL(
                        url
                    );

                },
                5000
            );


        } catch (error) {

            console.error(
                "CSV download failed:",
                error
            );

        }

    }


    /* ==============================
       CSV ESCAPING
       ============================== */

    private escapeCsvValue(
        value: string
    ): string {

        /*
         * CSV requires values containing
         * commas, quotes, or newlines to
         * be wrapped in double quotes.
         *
         * Existing quotes are doubled.
         */

        if (
            value.includes('"') ||
            value.includes(",") ||
            value.includes("\n") ||
            value.includes("\r")
        ) {

            return `"${value.replace(
                /"/g,
                '""'
            )}"`;

        }


        return value;

    }


    /* ==============================
       HTML ESCAPING
       ============================== */

    private escapeHtml(
        value: string
    ): string {

        return value
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* ==============================
       TIMESTAMP
       ============================== */

    private getTimestamp(): string {

        const now =
            new Date();


        return now
            .toISOString()
            .replace(
                /[:.]/g,
                "-"
            );

    }

}