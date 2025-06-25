import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getActiveTags, searchTags } from '../../store/slices/tagsSlice';
import { Tag } from '../../types';
import LiquidInput from '../common/LiquidInput';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagSelect,
  onTagRemove,
  maxTags = 10,
  placeholder = "タグを検索...",
  className = "",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTags, isLoading } = useSelector((state: RootState) => state.tags);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    dispatch(getActiveTags());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchTags(searchQuery));
    } else {
      setFilteredTags(activeTags);
    }
  }, [searchQuery, activeTags, dispatch]);

  useEffect(() => {
    // 既に選択されているタグを除外
    const availableTags = activeTags.filter(
      tag => !selectedTags.some(selected => selected.id === tag.id)
    );
    setFilteredTags(availableTags);
  }, [activeTags, selectedTags]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleTagClick = (tag: Tag) => {
    if (selectedTags.length < maxTags) {
      onTagSelect(tag);
      setSearchQuery('');
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagRemove(tagId);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-3"
        >
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm rounded-full"
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search input */}
      <div className="relative">
        <LiquidInput
          type="search"
          placeholder={selectedTags.length >= maxTags ? "最大タグ数に達しました" : placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          disabled={selectedTags.length >= maxTags}
        />

        {/* Tag count indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-text-muted">
          {selectedTags.length}/{maxTags}
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && searchQuery && filteredTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 glass-card rounded-xl shadow-glass-heavy max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-300 border-t-primary-500 rounded-full"
                  />
                  <span className="ml-2 text-text-muted">検索中...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTags.slice(0, 8).map((tag) => (
                    <motion.button
                      key={tag.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTagClick(tag)}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-glass-light rounded-lg transition-all duration-200 flex items-center justify-between"
                    >
                      <span>{tag.name}</span>
                      <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </motion.button>
                  ))}
                  
                  {filteredTags.length > 8 && (
                    <div className="px-3 py-2 text-xs text-text-muted border-t border-white/20 mt-2">
                      他 {filteredTags.length - 8} 件のタグがあります
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default TagSelector;