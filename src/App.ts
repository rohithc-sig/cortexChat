export class App {

    public render(): HTMLElement {

        const root = document.createElement("div");
        root.id = "cortex-chat";

        // -------------------------
        // Header
        // -------------------------

        const header = document.createElement("div");
        header.className = "chat-header";

        const title = document.createElement("div");
        title.className = "title";
        title.textContent = "🧠 Cortex Analyst";

        const subtitle = document.createElement("div");
        subtitle.className = "subtitle";
        subtitle.textContent = "Ask questions about your Power BI data";

        header.appendChild(title);
        header.appendChild(subtitle);

        // -------------------------
        // Messages
        // -------------------------

        const messages = document.createElement("div");
        messages.id = "messages";

        const assistant = document.createElement("div");
        assistant.className = "assistant-message";

        assistant.appendChild(document.createTextNode("👋 Welcome!"));
        assistant.appendChild(document.createElement("br"));
        assistant.appendChild(document.createElement("br"));

        assistant.appendChild(
            document.createTextNode("I'm your Cortex Analyst Assistant.")
        );

        assistant.appendChild(document.createElement("br"));
        assistant.appendChild(document.createElement("br"));

        assistant.appendChild(
            document.createTextNode("Ask me questions like:")
        );

        const ul = document.createElement("ul");

        [
            "Top 10 brands",
            "Revenue by retailer",
            "Sales trend"
        ].forEach(item => {

            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);

        });

        assistant.appendChild(ul);
        messages.appendChild(assistant);

        // -------------------------
        // Footer
        // -------------------------

        const footer = document.createElement("div");
        footer.className = "chat-footer";

        const input = document.createElement("input");
        input.id = "chatInput";
        input.placeholder = "Ask anything...";

        const button = document.createElement("button");
        button.id = "sendButton";
        button.textContent = "Send";

        footer.appendChild(input);
        footer.appendChild(button);

        // -------------------------
        // Build UI
        // -------------------------

        root.appendChild(header);
        root.appendChild(messages);
        root.appendChild(footer);

        return root;

    }

    public initialize(): void {

        const button = document.getElementById("sendButton") as HTMLButtonElement;
        const input = document.getElementById("chatInput") as HTMLInputElement;
        const messages = document.getElementById("messages") as HTMLDivElement;

        button.onclick = async () => {

    const question = input.value.trim();

    if (!question) {
        return;
    }

    // -------------------------
    // User Message
    // -------------------------

    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = question;

    messages.appendChild(userMessage);

    input.value = "";

    // -------------------------
    // Thinking Message
    // -------------------------

    const assistantMessage = document.createElement("div");
    assistantMessage.className = "assistant-message";
    assistantMessage.textContent = "Thinking...";

    messages.appendChild(assistantMessage);

    messages.scrollTop = messages.scrollHeight;

    try {

        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const result = await response.json();

        assistantMessage.innerHTML = `
            <b>Answer</b><br><br>
            ${result.answer}
            <br><br>
            <details>
                <summary>Generated SQL</summary>
                <pre>${result.sql}</pre>
            </details>
        `;

    } catch (err: any) {

        console.error("Fetch Error:", err);

    assistantMessage.textContent =
        `Error: ${err.message}`;

    }

    messages.scrollTop = messages.scrollHeight;
};
    }

}