import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Activity,
  Send,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  CheckCircle2,
  Stethoscope,
  BookOpen,
} from 'lucide-react';
import { CellItem, OrganelleItem, DiseaseStateItem } from '../types';

interface RightPanelProps {
  cell: CellItem;
  selectedOrganelleId: string;
  masteryScore: number;
  onAskAiTutor: (question: string) => void;
  aiTutorAnswer: string | null;
  isAiLoading: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  cell,
  selectedOrganelleId,
  masteryScore,
  onAskAiTutor,
  aiTutorAnswer,
  isAiLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'disease' | 'occurrence'>('details');
  const [customQuestion, setCustomQuestion] = useState('');

  const organelle: OrganelleItem =
    cell.organelles.find((o) => o.id === selectedOrganelleId) || cell.organelles[0];

  const diseaseState: DiseaseStateItem | undefined = cell.diseaseStates.find(
    (d) => d.organelleId === organelle.id
  );

  // 4 contextual prompt suggestions based on current organelle
  const contextualPrompts = [
    `How does ${organelle.name} maintain bioenergetic efficiency?`,
    `What triggers failure or degradation of ${organelle.name}?`,
    `Explain the evolutionary origins of ${organelle.name}.`,
    `How does ${organelle.name} interact with other cell structures?`,
  ];

  const handleSendQuestion = (q: string) => {
    if (!q.trim()) return;
    onAskAiTutor(q);
    setCustomQuestion('');
  };

  return (
    <aside
      id="specimen-details-panel"
      className="w-80 sm:w-96 border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col h-full transition-colors z-10"
    >
      {/* Tab Header: Anatomy / Disease State / Occurrence */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 bg-slate-50/50 dark:bg-slate-900/40">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
            activeTab === 'details'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Structure & Bio
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('disease')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 ${
            activeTab === 'disease'
              ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Pathology</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('occurrence')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
            activeTab === 'occurrence'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Distribution
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Organelle Hero Card with colored orb */}
        <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/90 dark:to-slate-950 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Organelle Profile
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {organelle.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {organelle.subtitle}
              </p>
            </div>

            {/* Glowing Orb */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: organelle.color,
                boxShadow: `0 8px 20px ${organelle.color}40`,
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Mastery Level Meter */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Mastery:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      lvl <= masteryScore
                        ? 'bg-amber-400 shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-500 font-semibold">
              {masteryScore === 5 ? 'Mastered' : `Level ${masteryScore}/5`}
            </span>
          </div>
        </div>

        {/* Tab 1: Structure & Bio Details */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Attribute Definition List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                Physicochemical Attributes
              </h4>
              <dl className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <dt className="text-[10px] font-bold uppercase text-slate-400">Primary Function</dt>
                  <dd className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {organelle.attributes.function}
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">Dimensions</dt>
                    <dd className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium">
                      {organelle.attributes.diameter}
                    </dd>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">Membrane</dt>
                    <dd className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium truncate">
                      {organelle.attributes.membrane}
                    </dd>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <dt className="text-[10px] font-bold uppercase text-slate-400">Biochemical Composition</dt>
                  <dd className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium">
                    {organelle.attributes.composition}
                  </dd>
                </div>

                {organelle.attributes.evolutionaryOrigin && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">Evolutionary Origin</dt>
                    <dd className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium">
                      {organelle.attributes.evolutionaryOrigin}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Biological Notes */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Biological Notes</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {organelle.note}
              </p>
            </div>

            {/* Clinical Context */}
            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs">
              <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-semibold mb-1">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinical & Medical Significance</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {cell.clinicalContext}
              </p>
            </div>

            {/* Fun Fact with sparkles icon */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fun Fact</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{organelle.fact}"
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Disease / Mutation Tab */}
        {activeTab === 'disease' && (
          <div className="space-y-3">
            {diseaseState ? (
              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-900 dark:text-rose-200">
                      {diseaseState.diseaseName}
                    </h4>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400">
                      Cytopathological State
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-rose-800 dark:text-rose-300 text-[11px] uppercase tracking-wide">
                    Molecular Pathology
                  </h5>
                  <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {diseaseState.pathology}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-rose-800 dark:text-rose-300 text-[11px] uppercase tracking-wide">
                    Microscopic / Ultrastructural Change
                  </h5>
                  <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px] bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-rose-200/40 dark:border-rose-900/30">
                    {diseaseState.visualChange}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-rose-800 dark:text-rose-300 text-[11px] uppercase tracking-wide">
                    Clinical Prognosis & Impact
                  </h5>
                  <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {diseaseState.clinicalImpact}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p>No primary genetic mutation registered for this specific organelle.</p>
                <p className="mt-1 text-[11px]">Check Mitochondria, Lysosomes, or Cell Membranes for defined disease models.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Occurrence & Distribution */}
        {activeTab === 'occurrence' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Tissue & Anatomical Distribution</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {cell.occurrence.distribution}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Abundance in Organism</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {cell.occurrence.abundance}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[10px] font-bold uppercase text-slate-400">Average Lifespan & Turnover</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {cell.occurrence.lifespan}
                </p>
              </div>
            </div>

            {/* Pattern art block */}
            <div className="p-3 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white border border-indigo-900/50 flex items-center gap-3">
              <Compass className="w-8 h-8 text-teal-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-teal-300">{cell.occurrence.tissueType}</p>
                <p className="text-[10px] text-slate-400">Specimen Classification: {cell.type}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Cytology Tutor Section */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                AI Cytology Tutor
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-medium border border-indigo-500/20">
              Interactive
            </span>
          </div>

          {/* Contextual prompt pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-medium text-slate-400">Quick inquiries:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {contextualPrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendQuestion(promptText)}
                  className="w-full text-left p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{promptText}</span>
                  <Zap className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display */}
          {(isAiLoading || aiTutorAnswer) && (
            <div className="p-3 rounded-xl bg-slate-900 text-slate-100 border border-indigo-500/30 text-xs shadow-md space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Tutor Insight</span>
              </div>
              {isAiLoading ? (
                <div className="flex items-center gap-2 py-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>Synthesizing biological explanation...</span>
                </div>
              ) : (
                <p className="leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {aiTutorAnswer}
                </p>
              )}
            </div>
          )}

          {/* Custom Question Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(customQuestion);
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder={`Ask about ${organelle.name}...`}
              className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!customQuestion.trim() || isAiLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Send to AI Tutor"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};
