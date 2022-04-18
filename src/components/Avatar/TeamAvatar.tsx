import React, { useMemo } from 'react';
import { Avatar, AvatarProps } from './Avatar';

// $keenote-blue-5
const backgroundColor = '#2f90ea';

export const TeamAvatar: React.FC<AvatarProps> = ({ style, ...restProps }) => {
    const mergedStyle: React.CSSProperties = useMemo(
        () => ({ backgroundColor, ...style }),
        [style]
    );

    return <Avatar style={mergedStyle} {...restProps} />;
};
