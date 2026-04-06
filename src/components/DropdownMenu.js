import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
export const DropdownMenu = ({ trigger, items, align = 'right', }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    const handleItemClick = (item) => {
        item.onClick();
        setIsOpen(false);
    };
    const getColorClass = (color) => {
        switch (color) {
            case 'success':
                return 'hover:bg-emerald-50 text-emerald-700';
            case 'danger':
                return 'hover:bg-red-50 text-red-700';
            default:
                return 'hover:bg-slate-50 text-slate-700';
        }
    };
    return (_jsxs("div", { className: "relative inline-block", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all", children: [trigger, _jsx("span", { className: `transition-transform ${isOpen ? 'rotate-180' : ''}`, children: "\u25BC" })] }), isOpen && (_jsx("div", { className: `absolute mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 ${align === 'right' ? 'right-0' : 'left-0'}`, children: _jsx("div", { className: "py-1", children: items.map((item, idx) => (_jsxs("button", { onClick: () => handleItemClick(item), className: `w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${getColorClass(item.color)}`, children: [item.icon && _jsx("span", { children: item.icon }), item.label] }, idx))) }) }))] }));
};
