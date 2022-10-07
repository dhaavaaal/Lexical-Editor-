import React from "react";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function onChange(state) {
  state.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
    console.log(selection);
  });
}
function LexicalEditor() {
  return (
    <div className="bg-white relative rounded-sm">
      <h1>Hello</h1>
      <LexicalComposer
        initialConfig={{
          theme: {
            paragraph: "mb-1", // tailwind classes work!
          },
          onError(error) {
            throw error;
          },
        }}
      >
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-[450px] outline-none py-[15px] px-2.5 resize-none overflow-hidden text-ellipsis" />
          }
          placeholder={
            <div className="absolute top-[15px] left-[10px] pointer-events-none select-none">
              Now write something brilliant...
            </div>
          }
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
}

export default LexicalEditor;

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
    }
  }, [editor]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [updateToolbar, editor]);

  return (
    <div className="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 min-w-52 h-10 px-2 py-2 bg-[#1b2733] mb-4 space-x-2 flex items-center">
      <button
        // className={clsx(
        //   "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
        //   isBold ? "bg-gray-700" : "bg-transparent"
        // )}
        onClick={() => {
          console.log("CLICK");
          // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        hello
        <FontAwesomeIcon
          icon="fa-solid fa-bold"
          className="text-white w-3.5 h-3.5"
        />
      </button>

      <button
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          isItalic ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <FontAwesomeIcon
          icon="fa-solid fa-italic"
          className="text-white w-3.5 h-3.5"
        />
      </button>
      {/* ... */}
    </div>
  );
};
