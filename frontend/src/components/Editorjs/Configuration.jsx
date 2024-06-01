import React from "react";
import SimpleImage from "./SimpleImage";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Header from "editorjs-header-with-anchor";
import Table from "@editorjs/table";
import CodeBox from "@bomdi/codebox";
import Delimiter from "@editorjs/delimiter";
// import Paragraph from "@editorjs/paragraph";
import TextVariantTune from "@editorjs/text-variant-tune";
import Underline from "@editorjs/underline";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Title from "title-editorjs";
import Paragraph from "editorjs-paragraph-with-alignment";
import MermaidTool from "editorjs-mermaid";


const Configuration = (description, onReadyCallback) => {
  console.log("description", description);
  return {
    /**
     * Id of Element that should contain Editor instance
     */
    holder: "editorjs",
    autofocus: true,
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: "Enter a header",
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 3,
        },
      },
      table: Table,
      image: {
        class: SimpleImage,
        inlineToolbar: true,
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
      OrderedList: {
        class: NestedList,
        inlineToolbar: true,
        config: {
          defaultStyle: "ordered",
        },
      },
      delimiter: Delimiter,
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      title: Title,
      mermaid: MermaidTool,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        tunes: ["textVariant"],
      },
      textVariant: TextVariantTune,
      underline: Underline,
      inlineCode: {
        class: InlineCode,
        shortcut: "CMD+SHIFT+M",
      },
      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
      },
      codeBox: {
        class: CodeBox,
        config: {
          themeURL:
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/dracula.min.css", // Optional
          themeName: "atom-one-dark", // Optional
          useDefaultTheme: "light", // Optional. This also determines the background color of the language select drop-down
        },
      },
    },
    data: description,
    onReady: onReadyCallback, 
  };
};

export default Configuration;
