import { useMemo, useState } from "react";
import { useSpeech } from "react-text-to-speech"; // Assuming 'use-speech' is the library you're using

function useChangeableSpeech() {
  const [text, setText] = useState<string>("");
  const { start } = useSpeech({ text, voiceURI: "Google US English", rate: 0.8 });
  const response = useMemo(
    () => ({
      setText,
      start,
    }),
    [setText, start]
  );

  return response;
}

export default useChangeableSpeech;
