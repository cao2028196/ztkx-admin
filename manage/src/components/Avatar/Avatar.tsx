import React, { useMemo } from 'react';
import { Avatar as ArcoAvatar, AvatarProps as ArcoAvatarProps } from '@arco-design/web-react';
import { generateColorByHex } from './utils';
import { useIsImgSrcAvailable } from '../../hooks';
import { Text } from './Text';
import { Hex } from '../../typings';

export interface AvatarProps extends ArcoAvatarProps {
    /**
     * 图片地址
     */
    src?: string;
    /**
     * 图片地址不存时的替代文字
     */
    alt: React.ReactNode;
    /**
     * 用以计算无图片时文字头像的背景颜色
     */
    id?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    children,
    id,
    style,
    autoFixFontSize = true,
    ...restProps
}) => {
    const backgroundColor = useMemo(() => generateColorByHex((id?.charAt(0) ?? '0') as Hex), [id]);

    const mergedStyle: React.CSSProperties = useMemo(
        () => ({ backgroundColor, ...style }),
        [style, backgroundColor]
    );
    const [available] = useIsImgSrcAvailable(src);

    return (
        <ArcoAvatar style={mergedStyle} autoFixFontSize={autoFixFontSize} {...restProps}>
            {children ? (
                children
            ) : available ? (
                <img src={src} />
            ) : (
                <Text autoFixFontSize={autoFixFontSize}>{alt || '头像'}</Text>
            )}
        </ArcoAvatar>
    );
};
