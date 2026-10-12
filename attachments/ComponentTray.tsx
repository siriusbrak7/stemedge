import React from 'react';
import { ComponentType } from './physics';
import { Battery, Gauge, Sparkles, HelpCircle } from 'lucide-react';

interface ComponentTrayProps {
  onSelectComponentType: (type: ComponentType) => void;
  selectedComponentType: ComponentType | null;
  isWiringMode: boolean;
  onToggleWiringMode: () => void;
  activeWireStartTerminal: string | null;
}

export const ComponentTray: React.FC<ComponentTrayProps> = ({
  onSelectComponentType,
  selectedComponentType,
  isWiringMode,
  onToggleWiringMode,
  activeWireStartTerminal,
}) => {
  const trayItems: Array<{
    type: ComponentType;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    colorClass: string;
    badgeText: string;
  }> = [
    {
      type: 'cell',
      label: '6.0 V Cell',
      sublabel: 'e.m.f. Source',
      badgeText: '6 V',
      colorClass: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
      icon: <Battery className="w-4 h-4 text-amber-400" />,
    },
    {
      type: 'resistor_10',
      label: '10.0 Ω Resistor',
      sublabel: 'Standard Load',
      badgeText: '10 Ω',
      colorClass: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
      icon: (
        <span className="w-4 h-2.5 rounded-xs border border-cyan-400 bg-cyan-950/60 inline-block font-mono text-[9px] text-center leading-none">
          R
        </span>
      ),
    },
    {
      type: 'resistor_20',
      label: '20.0 Ω Resistor',
      sublabel: 'Higher Load',
      badgeText: '20 Ω',
      colorClass: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10',
      icon: (
        <span className="w-4 h-2.5 rounded-xs border border-indigo-400 bg-indigo-950/60 inline-block font-mono text-[9px] text-center leading-none">
          R
        </span>
      ),
    },
    {
      type: 'ammeter',
      label: 'Ammeter',
      sublabel: 'Connect in Series (0 Ω)',
      badgeText: 'A',
      colorClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
      icon: <Gauge className="w-4 h-4 text-emerald-400" />,
    },
    {
      type: 'voltmeter',
      label: 'Voltmeter',
      sublabel: 'Connect in Parallel (∞ Ω)',
      badgeText: 'V',
      colorClass: 'border-sky-500/50 text-sky-400 bg-sky-500/10',
      icon: <Gauge className="w-4 h-4 text-sky-400" />,
    },
  ];

  return (
    <div
      id="circuits-component-tray"
      className="flex flex-col gap-2 p-2.5 rounded-xl bg-[#141722] border border-[#232938]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>IGCSE Component Tray</span>
        </span>
        <span className="text-[11px] text-slate-400">
          {activeWireStartTerminal
            ? 'Click target terminal to complete wire'
            : selectedComponentType
            ? 'Click empty slot to place'
            : 'Click part, then click slot'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {trayItems.map((item) => {
          const isSelected = selectedComponentType === item.type;
          return (
            <button
              key={item.type}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', item.type);
                onSelectComponentType(item.type);
              }}
              onClick={() => {
                onSelectComponentType(isSelected ? (null as any) : item.type);
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center group cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                  : 'bg-[#181D2A] border-[#232938] hover:border-slate-600 hover:bg-[#1E2333]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {item.icon}
                <span className="text-xs font-bold text-slate-100">{item.badgeText}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 leading-tight">
                {item.label}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">{item.sublabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
