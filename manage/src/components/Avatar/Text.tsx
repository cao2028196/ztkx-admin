import { AvatarProps as ArcoAvatarProps } from '@arco-design/web-react';
import React, { useRef, useEffect } from 'react';

interface TextProps {
    children: React.ReactNode;
    autoFixFontSize?: ArcoAvatarProps['autoFixFontSize'];
}

const textBasicStyle: React.CSSProperties = {
    display: 'inline-block',
};

export const Text: React.FC<TextProps> = ({ children, autoFixFontSize }) => {
    const textRef = useRef<HTMLSpanElement>(null);

    const autoFixFontSizeHandler = () => {
        if (textRef.current) {
            textRef.current.style.transform = `scale(${0.9})`;
        }
    };

    useEffect(() => {
        if (autoFixFontSize) {
            autoFixFontSizeHandler();
        }
    }, [autoFixFontSize]);

    return (
        <span ref={textRef} style={textBasicStyle}>
            {children}
        </span>
    );
};
