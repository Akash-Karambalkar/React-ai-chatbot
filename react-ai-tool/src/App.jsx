import { useEffect, useRef, useState } from "react";
import "./App.css";
import { apiKey, URL } from "./constants";
import Answer from "./Components/Answers";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")),
  );
  const [selectedHistory, setselectedHistory] = useState("");
  const scrollToANs = useRef();

  const askQuestion = async () => {
    if (!question.trim() && !selectedHistory) return;
    if (loading) return;

    let history = [];
    if (question) {
      try {
        const storedHistory = localStorage.getItem("history");
        history = storedHistory ? JSON.parse(storedHistory) : [];

        if (!Array.isArray(history)) history = [];
      } catch (e) {
        history = []; // fallback if JSON is invalid
      }

      history = [question, ...history];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);

      // setLoading(true);
    }

    try {
      const payloadData = question || selectedHistory;
      const payload = {
        contents: [
          {
            parts: [{ text: payloadData }],
          },
        ],
      };
      setLoading(true);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const dataString =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      const dataArray = dataString
        .split("\n")
        .filter((line) => line.trim() !== "");

      setResult((prev) => [
        ...prev,
        { type: "q", text: question ? question : selectedHistory },
        { type: "a", text: dataArray },
      ]);

      setQuestion("");
    } catch (error) {
      console.error("Fetch Error:", error);
      setResult((prev) => [
        ...prev,
        {
          type: "a",
          text: [`Error: ${error.message}`],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };
  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);
  useEffect(() => {
    if (scrollToANs.current) {
      scrollToANs.current.scrollTop = scrollToANs.current.scrollHeight;
    }
  }, [result]);
  console.log(result);

  return (
    <div className="grid grid-cols-5 h-screen text-center bg-zinc-900">
      <div className="col-span-1 bg-zinc-800 h-screen border-r border-zinc-700">
        <h2 className="text-white p-4 font-bold flex text-center justify-center space-x-2">
          <span>History</span>
          <button onClick={clearHistory} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h2>
        <ul className="text-zinc-400 text-left overflow-auto  ">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <li
                key={index}
                className="p-1 pl-5 truncate cursor-pointer hover:bg-zinc-700 hover:text-zinc-200"
                onClick={() => {
                  setQuestion("");
                  setselectedHistory(item);
                }}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>

      <div className="col-span-4 h-screen flex flex-col p-10">
        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
          Hello User,Ask me Anything
        </h1>
        {loading ? (
          <div role="status" className="flex justify-center items-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 animate-spin text-zinc-800 fill-blue-500"
              viewBox="0 0 100 101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}

        <div
          className="flex-1 overflow-y-auto mb-6 custom-scrollbar"
          ref={scrollToANs}
        >
          <div className="text-left text-zinc-300 max-w-3xl mx-auto">
            <ul className="space-y-2">
              {result.map((item, index) =>
                item.type === "q" ? (
                  <li key={index} className="flex justify-end">
                    <div className="p-4 text-white bg-zinc-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-fit max-w-md">
                      {item.text}
                    </div>
                  </li>
                ) : (
                  <li key={index} className="flex justify-start">
                    <div className="p-4 bg-zinc-800 rounded-lg max-w-md space-y-1">
                      {Array.isArray(item.text) ? (
                        item.text.map((ansItem, ansIndex) => (
                          <Answer
                            key={ansIndex}
                            ans={ansItem}
                            totalresult={item.text.length}
                            index={ansIndex}
                          />
                        ))
                      ) : (
                        <Answer ans={item.text} totalresult={1} index={0} />
                      )}
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="bg-zinc-800 w-full max-w-2xl px-5 py-2 text-white m-auto rounded-full border border-zinc-700 flex items-center h-16 shadow-2xl">
          <input
            type="text"
            placeholder={loading ? "Thinking..." : "Ask anything"}
            className="bg-transparent w-full h-full p-3 outline-none"
            value={question}
            disabled={loading}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          />
          <button
            className={`${loading ? "bg-zinc-600" : "bg-blue-600 hover:bg-blue-700"} px-6 py-2 rounded-full transition-colors font-medium`}
            onClick={askQuestion}
            disabled={loading}
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
