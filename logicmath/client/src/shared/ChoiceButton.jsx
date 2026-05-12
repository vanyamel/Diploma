import React from 'react';

const ChoiceButton = ({
  choice,
  selected,
  status = null,
  onClick,
  disabled = false,
  size = 'md',
  children,
}) => {
  const isSelected = selected === choice;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-w-[48px]',
    md: 'px-5 py-2 text-lg min-w-[56px]',
    lg: 'w-20 h-20 text-2xl',
  };

  const getColor = () => {
    if (!isSelected) return 'bg-slate-900 border-slate-600 text-slate-200 hover:border-blue-400 hover:bg-blue-900/20 hover:scale-105';
    if (status === 'correct') return 'bg-emerald-500 border-emerald-400 text-white scale-105 shadow-lg shadow-emerald-500/30';
    if (status === 'wrong')   return 'bg-red-500 border-red-400 text-white';
    return 'bg-blue-500 border-blue-400 text-white scale-105 shadow-lg shadow-blue-500/20';
  };

  return (
    <button
      onClick={() => !disabled && onClick(choice)}
      disabled={disabled}
      className={`
        font-mono font-bold rounded-xl border-2 transition-all duration-150 select-none
        disabled:cursor-not-allowed disabled:opacity-50
        ${sizes[size]} ${getColor()}
      `}
    >
      {children ?? choice}
    </button>
  );
};

export default ChoiceButton;
