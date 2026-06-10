import { useState, useMemo, useRef, useCallback } from 'react';
import CategorySidebar from './components/CategorySidebar';
import TemplateList from './components/TemplateList';
import TemplateEditor from './components/TemplateEditor';
import VariablePanel from './components/VariablePanel';
import StatsPanel from './components/StatsPanel';
import FeedbackPanel from './components/FeedbackPanel';
import { categories, variables, templates as initialTemplates, feedbackReasons } from './data/mockData';

function filterAndSortTemplates(templates, activeCategory, searchQuery, sortMode) {
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
  result = [...result].sort((a, b) => {
    if (sortMode === 'usage') {
      return b.usageCount - a.usageCount;
    }
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  return result;
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplates[0]);
  const [templates, setTemplates] = useState(initialTemplates);
  const [sortMode, setSortMode] = useState('recent');
  const editorRef = useRef(null);

  const filteredTemplates = useMemo(
    () => filterAndSortTemplates(templates, activeCategory, searchQuery, sortMode),
    [templates, activeCategory, searchQuery, sortMode]
  );

  const detectedVariables = useMemo(() => {
    if (!selectedTemplate) return [];
    return variables.filter(v => selectedTemplate.content.includes(v.key));
  }, [selectedTemplate, variables]);

  const handleSaveTemplate = (updatedTemplate) => {
    const today = new Date().toISOString().split('T')[0];
    if (!updatedTemplate.id) {
      const newId = Date.now();
      const newTemplate = { ...updatedTemplate, id: newId, updatedAt: today, usageCount: 0, rating: 5.0 };
      setTemplates(prev => prev.concat(newTemplate));
      setSelectedTemplate(newTemplate);
    } else {
      const savedTemplate = { ...updatedTemplate, updatedAt: today };
      setTemplates(prev => prev.map(t =>
        t.id === updatedTemplate.id ? savedTemplate : t
      ));
      setSelectedTemplate(prev => prev && prev.id === updatedTemplate.id ? savedTemplate : prev);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => {
      const next = prev.filter(t => t.id !== templateId);
      const nextFiltered = filterAndSortTemplates(next, activeCategory, searchQuery, sortMode);
      setSelectedTemplate(currentSelected => {
        const stillExists = next.some(t => t.id === currentSelected?.id);
        if (stillExists) {
          return currentSelected;
        }
        return nextFiltered.length > 0 ? nextFiltered[0] : null;
      });
      return next;
    });
  };

  const handleInsertVariable = useCallback((variableKey) => {
    if (editorRef.current) {
      editorRef.current.insertVariable(variableKey);
    }
  }, []);

  const handleContentChange = useCallback((content) => {
    setSelectedTemplate(prev => prev ? { ...prev, content } : prev);
  }, []);

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
        sortMode={sortMode}
        onSortChange={setSortMode}
        onDeleteTemplate={handleDeleteTemplate}
      />

      <div className="flex-1 flex min-h-0">
        <TemplateEditor
          ref={editorRef}
          key={selectedTemplate?.id}
          template={selectedTemplate}
          variables={variables}
          onSave={handleSaveTemplate}
          onContentChange={handleContentChange}
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
