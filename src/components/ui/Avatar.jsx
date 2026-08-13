import React from 'react';
import { getAvatarById } from '../../data/avatars';

export function Avatar({ avatarId = 'avatar-01', size = 36, className = '', alt = 'User avatar' }) {
  const avatar = getAvatarById(avatarId);
  const RenderComponent = avatar.render;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      <RenderComponent />
    </div>
  );
}
