import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, value, options, onChange, placeholder = "Selecionar..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4, // Remove window.scrollY para posição fixa
        left: rect.left,      // Remove window.scrollX para posição fixa
        width: rect.width
      });
    }
  };

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true); // true para capturar em todos os elementos

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`
          w-full flex items-center justify-between px-4 py-2.5
          bg-white/5 border border-white/10 rounded-xl text-white
          hover:bg-white/10 hover:border-white/20
          focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-ada-red/50 border-ada-red/50' : ''}
        `}
      >
        <span className={`text-sm ${value === 'Todos' ? 'text-slate-400' : 'text-white'}`}>
          {displayValue}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu - Rendered as Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[99999]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 99999
          }}
        >
          <div className="glassmorphism rounded-xl border border-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`
                  w-full px-4 py-3 text-left text-sm transition-all duration-200
                  hover:bg-ada-red/10 hover:text-ada-red-light
                  ${value === option.value
                    ? 'bg-ada-red/20 text-ada-red-light border-l-2 border-ada-red'
                    : 'text-slate-300'
                  }
                  ${option.value === 'Todos' ? 'border-b border-white/10' : ''}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FilterDropdown;
