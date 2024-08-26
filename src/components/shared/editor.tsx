import React, { forwardRef, useEffect, useLayoutEffect, useRef, useImperativeHandle } from "react";
import Quill from "quill";
import { Form, FormItemProps } from "antd";
import "antd/dist/reset.css";

interface EditorProps extends FormItemProps {
  readOnly?: boolean;
  defaultValue?: Quill;
  onTextChange?: (delta: Quill, oldDelta: Quill, source: string) => void;
  onSelectionChange?: (range: Quill, oldRange: Quill, source: string) => void;
}

// Custom Quill Editor Component
const Editor = forwardRef<Quill | null, EditorProps>(({ readOnly = false, defaultValue, onTextChange, onSelectionChange, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  }, [onTextChange, onSelectionChange]);

  useImperativeHandle(ref, () => quillRef.current, [quillRef]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editorContainer = container.appendChild(document.createElement("div"));

    const quill = new Quill(editorContainer, {
      theme: "snow",
      readOnly: readOnly,
      modules: {
        toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], ["link", "image"]],
      },
    });

    quillRef.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    quill.on("text-change", (delta, oldDelta, source) => {
      onTextChangeRef.current?.(delta, oldDelta, source);
    });

    quill.on("selection-change", (range, oldRange, source) => {
      onSelectionChangeRef.current?.(range, oldRange, source);
    });

    return () => {
      quillRef.current = null;
      container.innerHTML = "";
    };
  }, []);

  return (
    <Form.Item {...props}>
      <div ref={containerRef} className="ant-input" style={{ minHeight: "200px" }} />
    </Form.Item>
  );
});

Editor.displayName = "Editor";

export default Editor;
