import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  icon?: string;
  onClick: () => void;
  color?: 'default' | 'success' | 'danger';
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    item.onClick();
    setIsOpen(false);
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'success':
        return 'hover:bg-emerald-50 text-emerald-700';
      case 'danger':
        return 'hover:bg-red-50 text-red-700';
      default:
        return 'hover:bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
      >
        {trigger}
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className={`w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${getColorClass(item.color)}`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
