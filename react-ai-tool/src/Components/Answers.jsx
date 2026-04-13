import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../Helper";

const Answer = ({ ans }) => {
  const [isHeading, setIsHeading] = useState(false);
  const [formattedText, setFormattedText] = useState("");

  useEffect(() => {
    // 1. Determine if it's a heading for styling
    setIsHeading(checkHeading(ans));

    // 2. Always clean the text for the display
    setFormattedText(replaceHeadingStarts(ans));
  }, [ans]);

  return (
    <div className="w-full">
      {isHeading ? (
        <h3 className="text-xl font-bold text-white mt-4 mb-2 border-b border-zinc-700 pb-1">
          {formattedText}
        </h3>
      ) : (
        <p className="pl-2 text-zinc-300 leading-relaxed">{formattedText}</p>
      )}
    </div>
  );
};
export default Answer;
