import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { URL } from "./constants";
import Answer from "./Components/Answers";
function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);

  const askQuestion = async () => {
    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: question,
              },
            ],
          },
        ],
      };

      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      response = await response.json();
      console.log(response);

      // Extract AI response
      let dataString =
        response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      console.log("AI:", dataString);
      const dataArray = dataString
        .split("\n")
        .filter((line) => line.trim() !== "");
      // dataString = dataString.map((item) => item.trim());

      setResult(dataArray); // always keep it as array
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="grid grid-cols-5 h-screen text-center bg-zinc-900">
      {/* Sidebar */}
      <div className="col-span-1 bg-zinc-800 h-screen border-r border-zinc-700">
        <h2 className="text-white p-4">History</h2>
      </div>

      {/* Main Content Area */}
      <div className="col-span-4 h-screen flex flex-col p-10">
        {/* Results Area: This will now scroll */}
        <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar">
          <div className="text-left text-zinc-300 max-w-3xl mx-auto">
            <ul className="list-none p-0">
              {result &&
                result.map(
                  (item, index) =>
                    // Only render if item isn't empty (common after a .split)
                    item && (
                      <li key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                        <Answer ans={item} />
                      </li>
                    ),
                )}
            </ul>
          </div>
        </div>

        {/* Input Bar Area: Stays at the bottom */}
        <div className="bg-zinc-800 w-full max-w-2xl px-5 py-2 text-white m-auto rounded-full border border-zinc-700 flex items-center h-16 shadow-2xl">
          <input
            type="text"
            placeholder="Ask anything"
            className="bg-transparent w-full h-full p-3 outline-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()} // Added Enter key support
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-full transition-colors"
            onClick={askQuestion}
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
