export class App {

    public render(): string {

        return `
        <div id="cortex-chat">

            <div class="chat-header">

                <div class="title">
                    🧠 Cortex Analyst
                </div>

                <div class="subtitle">
                    Ask questions about your Power BI data
                </div>

            </div>

            <div id="messages">

                <div class="assistant-message">
                    👋 Welcome!
                    <br><br>
                    I'm your Cortex Analyst Assistant.
                    <br><br>
                    Ask me questions like:
                    <ul>
                        <li>Top 10 brands</li>
                        <li>Revenue by retailer</li>
                        <li>Sales trend</li>
                    </ul>
                </div>

            </div>

            <div class="chat-footer">

                <input
                    id="chatInput"
                    placeholder="Ask anything..."
                />

                <button id="sendButton">
                    Send
                </button>

            </div>

        </div>
        `;

    }

    public initialize() {

        const button = document.getElementById("sendButton") as HTMLButtonElement;

        const input = document.getElementById("chatInput") as HTMLInputElement;

        const messages = document.getElementById("messages") as HTMLDivElement;

        button.onclick = () => {

            const question = input.value.trim();

            if(question==="")
                return;

            messages.innerHTML += `
                <div class="user-message">
                    ${question}
                </div>
            `;

            input.value="";

            messages.scrollTop = messages.scrollHeight;

        };

    }

}