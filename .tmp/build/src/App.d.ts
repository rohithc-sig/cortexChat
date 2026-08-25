import powerbi from "powerbi-visuals-api";
type VisualHost = powerbi.extensibility.visual.IVisualHost;
export declare class App {
    private container;
    private host;
    private pbiContext;
    private userEmail?;
    private userRegion?;
    private userIdentity;
    constructor(container: HTMLElement, host: VisualHost);
    private loadUserIdentity;
    setContext(context: any): void;
    setUserEmail(userEmail?: string): void;
    setUserRegion(userRegion?: string): void;
    private renderBaseUI;
    private attachEvents;
    private handleAskQuery;
    private renderResponse;
    private showToast;
    private buildCsvContent;
    private copyTextToClipboard;
    private downloadCsv;
    private escapeCsvValue;
    private escapeHtml;
    private getTimestamp;
}
export {};
