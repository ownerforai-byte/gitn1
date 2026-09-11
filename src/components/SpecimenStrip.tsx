import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Shuffle,
  Filter,
} from 'lucide-react';
import { CellId, CellItem, CellCategory } from '../types';
import { CELL_SPECIMENS } from '../data/cells';

interface SpecimenStripProps {
  selectedCellId: CellId;
  onSelectCell: (id: CellId) => void;
  favorites: CellId[];
  onToggleFavorite: (id: CellId) => void;
}

export const SpecimenStrip: React.FC<SpecimenStripProps> = ({
  selectedCellId,
  onSelectCell,
  favorites,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    CELL_SPECIMENS.forEach((c) => cats.add(c.category));
    return Array.from(cats);
  }, []);

  const filteredCells = useMemo(() => {
    return CELL_SPECIMENS.filter((cell) => {
      const matchesSearch =
        cell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cell.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cell.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFavorite = favoritesOnly ? favorites.includes(cell.id) : true;
      const matchesCategory = selectedCategory === 'All' ? true : cell.category === selectedCategory;

      return matchesSearch && matchesFavorite && matchesCategory;
    });
  }, [searchTerm, favoritesOnly, selectedCategory, favorites]);

  const handleSurpriseMe = () => {
    const remaining = CELL_SPECIMENS.filter((c) => c.id !== selectedCellId);
    if (remaining.length === 0) return;
    const randomCell = remaining[Math.floor(Math.random() * remaining.length)];
    onSelectCell(randomCell.id);
  };

  return (
    <div
      id="specimen-strip-container"
      className="h-28 px-4 sm:px-6 py-2 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col justify-between transition-colors z-20"
    >
      {/* Top Filter Controls Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter specimens..."
              className="pl-7 pr-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 sm:w-44"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Favorites Filter Toggle */}
          <button
            type="button"
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              favoritesOnly
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
            title="Show only favorited cell architectures"
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          {/* Surprise Me Picker */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Pick a random specimen"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Surprise</span>
          </button>

          {/* Specimen Counter Badge */}
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            {filteredCells.length} / {CELL_SPECIMENS.length}
          </span>
        </div>
      </div>

      {/* Horizontal Specimen Thumbnails Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-0.5 pt-1 no-scrollbar">
        {filteredCells.map((cell) => {
          const isSelected = selectedCellId === cell.id;
          const isFavorited = favorites.includes(cell.id);

          return (
            <div
              key={cell.id}
              onClick={() => onSelectCell(cell.id)}
              className={`group relative flex-shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02]'
              }`}
            >
              {/* Color indicator orb */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs transition-transform group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${cell.accentColor}, ${cell.accentSecondary})`,
                }}
              >
                {cell.name.slice(0, 1)}
              </div>

              {/* Cell Name & Category Details */}
              <div className="text-left pr-3">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {cell.name}
                  </h4>
                  {isFavorited && (
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {cell.type.split('•')[0].trim()}
                </p>
              </div>

              {/* Quick favorite star toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(cell.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-amber-500 text-slate-400 transition-opacity"
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
