export declare class App {
    private container;
    private inputField;
    private sendButton;
    private responseArea;
    private activeContext;
    render(): HTMLElement;
    initialize(): void;
    updateContext(context: any): void;
    private handleSend;
    private renderResults;
}
