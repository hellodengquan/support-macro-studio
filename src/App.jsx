import { useState, useMemo } from 'react';
import CategorySidebar from './components/CategorySidebar';
import TemplateList from './components/TemplateList';
import TemplateEditor from './components/TemplateEditor';
import VariablePanel from './components/VariablePanel';
import StatsPanel from './components/StatsPanel';
import FeedbackPanel from './components/FeedbackPanel';
import { categories, variables, templates as initialTemplates, feedbackReasons } from './data/mockData';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplates[0]);
  const [templates, setTemplates] = useState(initialTemplates);

  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        t => t.title.toLowerCase().includes(query) || t.content.toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeCategory, searchQuery, templates]);

  const detectedVariables = useMemo(() => {
    if (!selectedTemplate) return [];
    return variables.filter(v => selectedTemplate.content.includes(v.key));
  }, [selectedTemplate, variables]);

  const handleSaveTemplate = (updatedTemplate) => {
    setTemplates(prev => prev.map(t =>
      t.id === updatedTemplate.id ? { ...updatedTemplate, updatedAt: new Date().toISOString().split('T')[0] } : t
    ));
    setSelectedTemplate(prev => prev.id === updatedTemplate.id ? { ...updatedTemplate, updatedAt: new Date().toISOString().split('T')[0] } : prev);
  };

  const handleInsertVariable = (variableKey) => {
    if (!selectedTemplate) return;
    const newContent = selectedTemplate.content + variableKey;
    const updated = { ...selectedTemplate, content: newContent };
    setSelectedTemplate(updated);
    handleSaveTemplate(updated);
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <CategorySidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <TemplateList
        templates={filteredTemplates}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectTemplate={setSelectedTemplate}
        selectedId={selectedTemplate?.id}
      />

      <div className="flex-1 flex min-h-0">
        <TemplateEditor
          key={selectedTemplate?.id}
          template={selectedTemplate}
          variables={variables}
          onSave={handleSaveTemplate}
        />
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 space-y-4 overflow-y-auto flex-shrink-0">
          <VariablePanel
            variables={variables}
            onInsertVariable={handleInsertVariable}
            detectedVariables={detectedVariables}
          />
          <StatsPanel templates={templates} />
          <FeedbackPanel
            template={selectedTemplate}
            feedbackReasons={feedbackReasons}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
