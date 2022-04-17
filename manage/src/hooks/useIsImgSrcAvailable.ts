import { useState, useEffect } from 'react';

interface State {
    value: boolean;
    loading: boolean;
}

const negativeState = {
    value: false,
    loading: false,
};

const positiveState = {
    value: true,
    loading: false,
};

/**
 * 检查图片地址是否可用
 */

/**
 * 检查图片地址是否可用
 * @param src 图标地址
 * @returns [value, loading] - [可用，检查中]
 */
export const useIsImgSrcAvailable = (src: string | undefined) => {
    const [state, setState] = useState<State>({
        value: !!src,
        loading: false,
    });

    useEffect(() => {
        setState((prev) => ({ ...prev, loading: true }));

        const img = new Image();

        img.src = src ?? '';

        img.onload = () => {
            if (img.naturalWidth) {
                setState(positiveState);
            } else {
                setState(negativeState);
            }
        };

        img.onerror = () => {
            setState(negativeState);
        };
    }, [src]);

    return [state.value, state.loading] as [boolean, boolean];
};
