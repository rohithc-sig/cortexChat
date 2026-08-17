export declare class App {
    private container;
    private pbiContext;
    constructor(container: HTMLElement);
    setContext(context: any): void;
    private renderBaseUI;
    private attachEvents;
    private handleAskQuery;
    private renderResponse;
    private buildCsvContent;
    private copyTextToClipboard;
    private downloadCsv;
    private escapeCsvValue;
    private escapeHtml;
    private getTimestamp;
}
