import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Components } from "react-markdown";

// Custom image component that reads width from title
// Format: ![Alt text](url "width:50") -> renders at 50px width
const components: Components = {
  img: ({ node, ...props }) => {
    // Extract width from title if present (format: "width:50")
    const title = (props.title as string) || "";
    const widthMatch = title.match(/width:(\d+)/);
    const width = widthMatch ? widthMatch[1] : null;
    
    // Merge with existing style and ensure width takes precedence
    const style = width 
      ? { ...props.style, width: `${width}px`, height: "auto", maxWidth: `${width}px` }
      : props.style;
    
    // Remove the width: prefix from title if present
    const cleanTitle = title.replace(/width:\d+\s*/, "").trim() || undefined;
    
    return <img {...props} style={style} title={cleanTitle} />;
  },
};

export default function MarkdownView({ markdown }: { markdown: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}


