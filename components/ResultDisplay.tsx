import React from 'react';

// This is a simple markdown-to-HTML converter for demonstration purposes.
// For a production app, a more robust library like 'marked' or 'react-markdown' would be better.
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-pink-400">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3 text-purple-400">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
      .replace(/(\n- .*)+/g, (match) => `<ul class="list-disc list-inside mb-4">${match.replace(/^- /gm, '')}</ul>`)
      .replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};


interface ResultDisplayProps {
  explanation: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ explanation }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl animate-fade-in">
      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-slate-100 prose-a:text-purple-400 hover:prose-a:text-purple-300">
        <SimpleMarkdown text={explanation} />
      </div>
    </div>
  );
};
