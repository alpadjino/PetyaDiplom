import {
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandItem,
  EditorContent,
  EditorRoot,
} from "novel";

export const NovelEditor = () => (
  <EditorRoot>
    <EditorContent>
      <EditorCommand>
        <EditorCommandItem />
        <EditorCommandItem />
        <EditorCommandItem />
      </EditorCommand>
      <EditorBubble>
        <EditorBubbleItem />
        <EditorBubbleItem />
        <EditorBubbleItem />
      </EditorBubble>
    </EditorContent>
  </EditorRoot>
);
