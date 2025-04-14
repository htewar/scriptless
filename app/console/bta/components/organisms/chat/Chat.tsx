'use client';

import { useChat, type Message } from '@ai-sdk/react'
import { useRef, useState, useEffect, DragEvent } from 'react';
import { FaPaperclip, FaTrashAlt, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import { BsStars } from "react-icons/bs";
import { FiSend, FiStopCircle } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-baseline">
        <motion.div
          className="h-2 w-2 bg-gray-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-2 w-2 bg-gray-500 rounded-full ml-1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.div
          className="h-2 w-2 bg-gray-500 rounded-full ml-1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === 'string' ? text.slice(0, 100) : '');
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div className="text-xs max-w-xs max-h-20 overflow-hidden text-gray-700 border border-gray-300 p-2 rounded-md bg-gray-50 shadow-sm">
      <pre className="whitespace-pre-wrap break-words">{content || 'Reading file...'}{content.length >= 100 && '...'}</pre>
    </div>
  );
}

export default function Chat() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading, stop, addToolResult } = useChat({
    api: '/api/v1/bta/chat'
  });
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add effect to monitor message changes
  useEffect(() => {
    console.log('Messages changed:', messages);
  }, [messages]);

  useEffect(() => {
    // Add a welcome message on load
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Welcome to the AI Chat! How can I help you today?\n\nYou can:\n*   Ask questions about your APIs.\n*   Drop Postman collections (.json) or text files (.txt, .pdf) with API details for analysis.',
        },
      ]);
    }
  }, [setMessages, messages.length]);

  // Drag & Drop Handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;
    const validFiles = Array.from(droppedFiles).filter((file) =>
      ['text/plain', 'application/json', 'application/pdf'].includes(file.type)
    );

    if (validFiles.length === droppedFiles.length) {
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
    } else {
      toast.error('Only .txt, .pdf, or .json files are allowed!');
    }
  };

  return (
  <div className="flex flex-col h-full bg-gray-50">
    <div className="flex flex-col w-full max-w-4xl mx-auto h-full">
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-blue-100/80 z-10 border-4 border-dashed border-blue-400 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xl font-semibold text-blue-700">Drop .txt, .pdf, or .json files here</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col w-full h-full">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <motion.div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {!isUser && (
                  <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center">
                    <BsStars className="text-purple-700" size={20} />
                  </div>
                )}

                <div className={`p-3 rounded-xl max-w-[85%] md:max-w-[75%] relative group ${
                  isUser ? 'bg-gray-800 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete message"
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </button>

                  <div className="whitespace-pre-wrap text-base break-words">
                    {message.parts?.map((part, index) => {
                      const partKey = `${message.id}-part-${index}`;
                      switch (part.type) {
                        case 'step-start':
                          return index > 0 ? (
                            <div key={partKey} className="text-gray-400 my-2">
                              <hr className="border-gray-200" />
                            </div>
                          ) : null;
                         case 'text':
                           const textParts = part.text.split(/(\*\*.*?\*\*)/g);
                           return (
                             <div className="whitespace-pre-wrap text-xl break-words" key={partKey}>
                               {textParts.map((text, i) => {
                                 if (text.startsWith('**') && text.endsWith('**')) {
                                   return <strong key={i} className="font-semibold">{text.slice(2, -2)}</strong>;
                                 }
                                 return <span key={i}>{text}</span>;
                               })}
                             </div>
                           );

                         case 'tool-invocation': {
                           const toolInvocation = part.toolInvocation;
                           if (!toolInvocation) {
                             return <div key={partKey} className="text-xs text-red-600 italic">Error: Missing tool invocation data.</div>;
                           }
                           const toolCallId = toolInvocation.toolCallId;
                           const toolName = toolInvocation.toolName;

                           console.log("Tool call received:", {
                             toolName,
                             state: 'state' in toolInvocation ? toolInvocation.state : 'unknown',
                             args: toolInvocation.args
                           });

                           switch (toolName) {
                             case 'request_json_generation_confirmation': {
                               if (toolInvocation.state === 'call') {
                                 return (
                                   <div key={toolCallId} className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-base">
                                     <p className="mb-2 text-gray-700">{toolInvocation.args.message}</p>
                                     <div className="flex gap-2">
                                       <button
                                         className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium"
                                         onClick={() => {
                                           console.log("Confirming tool call:", toolCallId);
                                           addToolResult({
                                             toolCallId: toolCallId,
                                             result: 'Yes, proceed with JSON generation.',
                                           });
                                         }}
                                       >
                                         Generate JSON
                                       </button>
                                       <button
                                         className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium"
                                         onClick={() => {
                                           console.log("Rejecting tool call:", toolCallId);
                                           addToolResult({
                                             toolCallId: toolCallId,
                                             result: 'No, wait. I need to provide more details.',
                                           });
                                         }}
                                       >
                                         No, Cancel
                                       </button>
                                     </div>
                                   </div>
                                 );
                               } else if (toolInvocation.state === 'result') {
                                 return (
                                   <div key={toolCallId} className="mt-1 text-sm italic text-gray-500">
                                     Response sent: {typeof toolInvocation.result === 'string' ? toolInvocation.result : JSON.stringify(toolInvocation.result)}
                                   </div>
                                 );
                               } else {
                                 return <div key={toolCallId} className="text-sm text-orange-500 italic">Tool {toolName} state: {toolInvocation.state}</div>;
                               }
                             }

                             case 'display_json_output': {
                               let testSuiteData = null;
                               if ('state' in toolInvocation && toolInvocation.state === 'result') {
                                 testSuiteData = (toolInvocation as any).result;
                               } else if ('state' in toolInvocation && (toolInvocation.state === 'call' || toolInvocation.state === 'partial-call')) {
                                 testSuiteData = toolInvocation.args?.testSuite;
                               }

                               if (!testSuiteData) {
                                 const state = 'state' in toolInvocation ? toolInvocation.state : 'unknown';
                                 return <div key={toolCallId} className="text-sm text-red-600 italic">Error: Test suite data missing for tool '{toolName}' in state '{state}'.</div>;
                               }
                               return (
                                 <div key={toolCallId} className="mt-2 relative bg-gray-800 rounded-md overflow-hidden">
                                   <SyntaxHighlighter
                                     language="json"
                                     style={syntaxTheme}
                                     customStyle={{ maxHeight: '300px', overflowY: 'auto', margin: 0, padding: '0.75rem', fontSize: '0.9rem' }}
                                     PreTag="div"
                                     className="rounded-md"
                                   >
                                     {JSON.stringify(testSuiteData, null, 2)}
                                   </SyntaxHighlighter>
                                 </div>
                               );
                             }
                             default:
                               const state = 'state' in toolInvocation ? toolInvocation.state : 'unknown';
                               return <div key={toolCallId} className="text-sm text-orange-500 italic">Unhandled tool call: {toolName} (State: {state})</div>;
                           }
                         }

                         default:
                           return <div key={partKey} className="text-xs text-red-600 italic">Unhandled part type: {(part as any).type}</div>;
                       }
                    })}
                  </div>
                  {message?.experimental_attachments
                    ?.filter((attachment) => attachment?.contentType?.startsWith('text/') || attachment?.contentType === 'application/pdf')
                    .map((attachment, index) => (
                      <a
                        key={`${message.id}-${index}`}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-2 inline-flex items-center gap-1 text-xs ${isUser ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'} underline`}
                      >
                        {attachment?.contentType === 'application/pdf' ? <FaFilePdf className="inline-block h-3 w-3" /> : <FaFileAlt className="inline-block h-3 w-3" /> }
                        {attachment.name ?? `attachment-${index}`}
                      </a>
                    ))}
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start"
            >
               <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center">
                   <BsStars className={`${isLoading ? 'animate-pulse text-purple-600' : ''}`} size={20} />
                 </div>
                <div className="p-3 rounded-xl bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm flex items-center">
                  <TypingIndicator />
                </div>
               </div>
            </motion.div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-3">
            {/* File Previews - Moved outside and above the form */}
            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2"> {/* Removed px-2, added mb-2 */}
                {Array.from(files).map((file, index) => (
                  <div key={index} className="relative group bg-gray-100 p-1 rounded border border-gray-300">
                    <TextFilePreview file={file} />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFiles = new DataTransfer();
                        Array.from(files).forEach((f, i) => {
                          if (i !== index) {
                            updatedFiles.items.add(f);
                          }
                        });
                        setFiles(updatedFiles.files.length > 0 ? updatedFiles.files : undefined);
                        // Also clear the input value if this was the last file
                        if (updatedFiles.files.length === 0 && fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={(event) => {
                 if (isLoading || !input.trim()) return;
                 const options = files ? { experimental_attachments: files } : {};
                 handleSubmit(event, options);
                 setFiles(undefined);
                 if (fileInputRef.current) {
                   fileInputRef.current.value = '';
                 }
              }}
              className="flex items-end bg-white w-full p-2 rounded-full shadow-md border border-gray-200" /* Changed items-center to items-end */
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Attach file"
              >
                <FaPaperclip size={20} />
              </button>
              <input
                type="file"
                multiple
                accept=".txt,.pdf,.json"
                ref={fileInputRef}
                className="hidden"
                onChange={event => {
                    const newFiles = event.target.files;
                    if (newFiles) {
                      const combinedFiles = new DataTransfer();
                      if (files) {
                         Array.from(files).forEach(f => combinedFiles.items.add(f));
                      }
                      Array.from(newFiles).forEach(f => combinedFiles.items.add(f));
                      setFiles(combinedFiles.files);
                    }
                }}
              />

              <input
                type="text"
                className="flex-grow mx-2 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-xl"
                placeholder="Enter a prompt here"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoading && input.trim()) {
                         const form = e.currentTarget.closest('form');
                         form?.requestSubmit();
                      }
                   }
                }}
              />

              {isLoading ? (
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={stop}
                  aria-label="Stop generation"
                >
                  <FiStopCircle size={22} />
                </button>
              ) : (
                <button
                  type="submit"
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 ${input.trim() ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <FiSend size={22} />
                </button>
              )}
            </form>
            <p className="text-xs text-gray-500 text-center mt-2">AI responses may be inaccurate. Verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}