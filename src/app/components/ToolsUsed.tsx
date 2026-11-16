interface Tool {
  name: string;
  category: string;
}

interface ToolsUsedProps {
  tools: Tool[];
  gradient?: string;
}

export function ToolsUsed({ 
  tools,
  gradient = "from-blue-600 to-cyan-600"
}: ToolsUsedProps) {
  // Group tools by category
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className={`text-2xl font-bold mb-8 text-center bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          Tools & Technologies
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedTools).map(([category, toolNames]) => (
            <div 
              key={category}
              className="bg-white border border-neutral-200 rounded-xl p-6"
            >
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {toolNames.map((name) => (
                  <span 
                    key={name}
                    className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
