import powerbi from "powerbi-visuals-api";
import { CHAT_ENDPOINT } from "./backend";

type VisualHost = powerbi.extensibility.visual.IVisualHost;

export class App {
    private container: HTMLElement;
    private host: VisualHost;
    private pbiContext: any = { categories: [] };
    private userEmail?: string;
    private userRegion?: string;
    private userIdentity: {
        status: "available" | "unavailable";
        userId?: string;
        tenantId?: string;
        error?: string;
    } = { status: "unavailable" };

    constructor(container: HTMLElement, host: VisualHost) {
        this.container = container;
        this.host = host;
        this.renderBaseUI();
        this.loadUserIdentity();
    }

    private async loadUserIdentity(): Promise<void> {
        try {
            const result =
                await this.host.acquireAADTokenService.acquireAADToken();

            this.userIdentity = {
                status: "available",
                userId: result.userInfo?.userId,
                tenantId: result.userInfo?.tenantId
            };
        } catch (error: any) {
            this.userIdentity = {
                status: "unavailable",
                error: error?.message || "Identity unavailable"
            };
        }
    }

    public setContext(context: any) {
        this.pbiContext = context;
    }

    public setUserEmail(userEmail?: string) {
        this.userEmail = userEmail;
    }

    public setUserRegion(userRegion?: string) {
        this.userRegion = userRegion;
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

                .request-debug-header-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    width: 100%;
                }

                .request-debug-title {
                    font-size: 9px;
                    font-weight: 700;
                    color: #1d4ed8;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                .request-debug-actions {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .request-debug-toggle,
                .request-debug-toggle:hover,
                .request-debug-toggle:active {
                    border: 1px solid #93c5fd;
                    background-color: #ffffff;
                    color: #1d4ed8;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 9px;
                    font-weight: 700;
                    cursor: pointer;
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
                   TOAST NOTIFICATIONS
                   ============================== */

                .toast-container {
                    position: absolute;
                    right: 12px;
                    bottom: 12px;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    pointer-events: none;
                }

                .toast,
                .toast-notification {
                    min-width: 190px;
                    max-width: 280px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    pointer-events: auto;
                    animation: toast-notification-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: all 0.2s ease;
                }

                .toast-success,
                .toast-notification-success {
                    border: 1px solid #86efac;
                    background-color: #f0fdf4;
                    color: #166534;
                }

                .toast-error,
                .toast-notification-error {
                    border: 1px solid #fca5a5;
                    background-color: #fef2f2;
                    color: #991b1b;
                }

                .toast-info,
                .toast-notification-info {
                    border: 1px solid #93c5fd;
                    background-color: #eff6ff;
                    color: #1e40af;
                }

                .toast-notification-fade-out {
                    animation: toast-notification-out 0.2s cubic-bezier(0.7, 0, 0.84, 0) forwards;
                }

                @keyframes toast-notification-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes toast-notification-out {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(10px) scale(0.96);
                    }
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

                /* ==============================
                   TABLE STYLES (STICKY, STRIPED, HOVER)
                   ============================== */

                .data-table-wrapper {
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    overflow-x: auto;
                    max-height: 300px;
                    overflow-y: auto;
                    margin-top: 10px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
                }

                .data-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 12px;
                }

                .data-table th {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    text-align: left;
                    padding: 8px 10px;
                    background-color: #f8fafc;
                    color: #64748b;
                    font-weight: 600;
                    border-bottom: 1px solid #e2e8f0;
                    text-transform: uppercase;
                    font-size: 10px;
                    box-shadow: 0 1px 0 #e2e8f0;
                }

                .data-table td {
                    padding: 8px 10px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #1e293b;
                    transition: background-color 0.15s ease;
                }

                /* Row Striping */
                .data-table tbody tr {
                    background-color: #ffffff;
                    transition: background-color 0.16s ease, box-shadow 0.16s ease;
                }

                .data-table tbody tr:nth-child(odd) {
                    background-color: #ffffff;
                }

                .data-table tbody tr:nth-child(even) {
                    background-color: #f5f5f5;
                }

                /* Row Hover */
                .data-table tbody tr:hover {
                    background-color: #eaf3ff;
                    box-shadow: inset 0 0 0 1px #d0e4ff;
                }

                /* Cell Hover */
                .data-table td:hover {
                    background-color: transparent;
                }

                /* ==============================
                   EXECUTIVE KPI CALLOUT CARDS
                   ============================== */

                .kpi-cards-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 10px;
                    margin: 12px 0;
                }

                .kpi-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 10px 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }

                .kpi-card:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
                }

                .kpi-title {
                    font-size: 10px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .kpi-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                    line-height: 1.2;
                }

                .kpi-subtext {
                    font-size: 10px;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .kpi-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 6px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                }

                .kpi-badge-success {
                    background-color: #dcfce7;
                    color: #15803d;
                }

                .kpi-badge-danger {
                    background-color: #fee2e2;
                    color: #991b1b;
                }

                /* ==============================
                   DOWNLOAD / COPY BUTTONS
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

                .follow-up-section {
                    margin-top: 12px;
                    border: 1px solid #dbeafe;
                    background-color: #f8fbff;
                    border-radius: 12px;
                    padding: 10px 12px;
                }

                .follow-up-title {
                    font-size: 9px;
                    font-weight: 700;
                    color: #1d4ed8;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }

                .follow-up-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .follow-up-chip {
                    background-color: #ffffff;
                    border: 1px solid #bfdbfe;
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: 11px;
                    color: #1d4ed8;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .follow-up-chip:hover {
                    background-color: #eff6ff;
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

                <div class="request-debug-section">

                    <div class="request-debug-header-row">

                        <div class="request-debug-title">
                            REQUEST SENT BY POWER BI
                        </div>

                        <div class="request-debug-actions">

                            <button
                                class="request-debug-toggle"
                                data-action="toggle-debug"
                                type="button"
                            >
                                Show
                            </button>

                            <button
                                id="copyRequestBtn"
                                class="copy-request-btn"
                                type="button"
                            >
                                Copy
                            </button>

                        </div>

                    </div>

                    <pre
                        id="requestDebugContent"
                        class="request-debug-content"
                        hidden
                    >{
  "question": "",
  "pbi_context": {
    "categories": []
  }
}</pre>

                </div>

                <div
                    id="cortexToast"
                    class="toast-container"
                    aria-live="polite"
                    aria-atomic="true"
                ></div>


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

        const debugToggleBtn =
            this.container.querySelector(
                "[data-action='toggle-debug']"
            ) as HTMLButtonElement;

        const debugContent =
            this.container.querySelector(
                "#requestDebugContent"
            ) as HTMLElement;

        if (debugToggleBtn && debugContent) {

            debugToggleBtn.addEventListener(
                "click",
                () => {

                    const isHidden =
                        debugContent.hidden;

                    debugContent.hidden =
                        !isHidden;

                    debugToggleBtn.textContent =
                        isHidden ? "Hide" : "Show";

                }
            );

        }


        if (copyRequestBtn) {

            copyRequestBtn.addEventListener(
                "click",
                async (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    const textToCopy =
                        debugContent?.textContent || "";

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

                        this.showToast(
                            "Power BI request copied",
                            "success"
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

                    } else {

                        this.showToast(
                            "Unable to copy Power BI request",
                            "error"
                        );

                    }

                }
            );

        }


        /* ==============================
           CSV DOWNLOAD & SQL COPY
           ============================== */

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

                        this.showToast(
                            "CSV data not found",
                            "error"
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

                        await this.downloadCsv(
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

                    if (copied) {
                        copyCsvButton.textContent =
                            "Copied!";

                        this.showToast(
                            "CSV copied to clipboard",
                            "success"
                        );
                    } else {
                        copyCsvButton.textContent =
                            originalButtonText;

                        this.showToast(
                            "Unable to copy CSV. Please try again.",
                            "error"
                        );
                    }

                    setTimeout(
                        () => {
                            copyCsvButton.textContent =
                                originalButtonText;
                        },
                        1200
                    );

                    return;
                }


                const followUpButton =
                    target.closest(
                        '[data-action="follow-up-question"]'
                    ) as HTMLButtonElement;


                if (followUpButton) {

                    event.preventDefault();
                    event.stopPropagation();

                    const inputEl =
                        this.container.querySelector(
                            "#cortexQueryInput"
                        ) as HTMLInputElement | null;

                    if (inputEl) {
                        inputEl.value =
                            followUpButton.dataset.question || "";

                        inputEl.focus();
                    }

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

                    if (copied) {
                        copySqlButton.textContent =
                            "Copied!";

                        this.showToast(
                            "SQL copied to clipboard",
                            "success"
                        );
                    } else {
                        copySqlButton.textContent =
                            originalButtonText;

                        this.showToast(
                            "Unable to copy SQL. Please try again.",
                            "error"
                        );
                    }

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


        await this.loadUserIdentity();

        const requestPayload = {

            question: queryText,

            pbi_context: this.pbiContext,

            user_email: this.userEmail,

            user_region: this.userRegion,

            user_identity: this.userIdentity

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
                    CHAT_ENDPOINT,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

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


        const followUpQuestions =
            Array.isArray(data.follow_up_questions)
                ? data.follow_up_questions.filter(
                      (q: any) =>
                          typeof q === "string" && q.trim()
                  )
                : [];

        const followUpHtml =
            followUpQuestions.length > 0
                ? `
                    <div class="follow-up-section">
                        <div class="follow-up-title">
                            Follow-up questions
                        </div>
                        <div class="follow-up-list">
                            ${followUpQuestions
                                .map(
                                    q => `
                                        <button
                                            class="follow-up-chip"
                                            type="button"
                                            data-action="follow-up-question"
                                            data-question="${this.escapeHtml(
                                                q
                                            )}"
                                        >
                                            ${this.escapeHtml(q)}
                                        </button>
                                    `
                                )
                                .join("")}
                        </div>
                    </div>
                `
                : "";

        botContent.innerHTML = `

            <div>
                ${data.answer || ""}
            </div>

            ${tableHtml}

            ${followUpHtml}

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


    private showToast(
        message: string,
        type: "success" | "error" | "info" = "success"
    ) {

        const toastHost =
            this.container.querySelector(
                "#cortexToast"
            ) as HTMLElement | null;

        if (!toastHost) {
            return;
        }

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `toast toast-${type} toast-notification toast-notification-${type}`;

        toast.textContent =
            message;

        toastHost.appendChild(
            toast
        );

        setTimeout(
            () => {
                toast.classList.add("toast-notification-fade-out");
                setTimeout(() => toast.remove(), 200);
            },
            2200
        );

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

    private async downloadCsv(
        columns: string[],
        rows: any[]
    ): Promise<boolean> {

        try {

            console.log("Starting Power BI CSV download...");

            const csvContent =
                this.buildCsvContent(
                    columns,
                    rows
                );

            if (!csvContent) {
                console.error("CSV content is empty");
                return false;
            }

            /*
            * Power BI Custom Visual File Download API
            *
            * This is the supported way to download files
            * from a custom visual.
            */

            if (!this.host.downloadService) {

                console.error(
                    "Power BI download service is unavailable."
                );

                this.showToast(
                    "Power BI download service is unavailable",
                    "error"
                );

                return false;
            }


            /*
            * Check whether Power BI allows this visual
            * to download files.
            */

            try {

                const status =
                    await this.host.downloadService.exportStatus();

                console.log(
                    "Power BI download status:",
                    status
                );

                if (
                    status !==
                    powerbi.PrivilegeStatus.Allowed
                ) {

                    console.error(
                        "Power BI download API is not allowed. Status:",
                        status
                    );

                    this.showToast(
                        "Downloads are not enabled for this custom visual",
                        "error"
                    );

                    return false;
                }

            } catch (statusError) {

                console.warn(
                    "Could not determine download API status:",
                    statusError
                );

            }


            const fileName =
                `cortex_analyst_result_${this.getTimestamp()}.csv`;


            /*
            * IMPORTANT:
            *
            * For CSV the content is passed directly as text.
            *
            * Do NOT create a Blob.
            * Do NOT create an object URL.
            * Do NOT use window.open().
            * Do NOT manually click an <a>.
            */

            const result =
                await this.host.downloadService.exportVisualsContent(
                    csvContent,
                    fileName,
                    "csv",
                    "Cortex Analyst query result"
                );


            console.log(
                "Power BI download result:",
                result
            );


            if (result) {

                this.showToast(
                    "CSV download started",
                    "success"
                );

                return true;
            }


            this.showToast(
                "Power BI could not download the CSV",
                "error"
            );

            return false;


        } catch (error: any) {

            console.error(
                "Power BI CSV download failed:",
                error
            );

            this.showToast(
                error?.message ||
                    "CSV download failed",
                "error"
            );

            return false;
        }

    }


    /* ==============================
       CSV ESCAPING
       ============================== */

    private escapeCsvValue(
        value: string
    ): string {

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