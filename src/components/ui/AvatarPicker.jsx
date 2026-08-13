import React from 'react';
import { AVATAR_LIST } from '../../data/avatars';
import { Avatar } from './Avatar';
import { Check } from 'lucide-react';

export function AvatarPicker({ selectedId = 'avatar-01', onSelect }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 py-2">
      {AVATAR_LIST.map((avatar) => {
        const isSelected = selectedId === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 border cursor-pointer ${
              isSelected
                ? 'border-kc-accent bg-kc-accent/10 shadow-kc-sm scale-105'
                : 'border-kc-border bg-kc-surface hover:border-kc-border-hover hover:bg-kc-surface-2 hover:scale-102'
            }`}
            aria-label={`Select avatar ${avatar.name}`}
            aria-pressed={isSelected}
          >
            <Avatar avatarId={avatar.id} size={48} className="transition-transform group-hover:scale-105" />
            <span className="mt-1 text-[11px] font-medium text-kc-muted truncate max-w-full text-center">
              {avatar.name}
            </span>
            {isSelected && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-kc-accent text-[#090909] rounded-full flex items-center justify-center shadow-md">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
