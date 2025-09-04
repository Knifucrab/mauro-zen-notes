import type { Tag } from '../types/Tag';

interface TagDisplayProps {
  tag: Tag;
  size?: 'sm' | 'md';
  noBorder?: boolean;
}

function TagDisplay({ tag, size = 'sm', noBorder = false }: TagDisplayProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
  const borderClasses = noBorder ? '' : 'border';
  
  return (
    <span 
      className={`${sizeClasses} rounded-full ${borderClasses} font-medium`}
      style={{ 
        backgroundColor: tag.color, 
        borderColor: noBorder ? 'transparent' : tag.color,
        color: '#000'
      }}
    >
      {tag.name}
    </span>
  );
}

export default TagDisplay;
