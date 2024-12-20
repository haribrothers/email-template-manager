import { Extension } from '@tiptap/core';

type ImageSize = 'small' | 'medium' | 'large';

interface Sizes {
  small: string;
  medium: string;
  large: string;
}

interface ImageAttributes {
  size?: ImageSize;
  [key: string]: any;
}

const sizes: Sizes = {
  small: '200px',
  medium: '400px',
  large: '800px'
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      setImageSize: (size: ImageSize) => ReturnType;
    };
  }
}

export const ImageResize = Extension.create({
  name: 'imageResize',

  addGlobalAttributes() {
    return [
      {
        types: ['image'],
        attributes: {
          size: {
            default: 'medium',
            parseHTML: element => element.getAttribute('data-size') as ImageSize || 'medium',
            renderHTML: attributes => {
              const attrs = attributes as ImageAttributes;
              const size = attrs['size'] || 'medium';
              return {
                'data-size': size,
                style: `max-width: ${sizes[size]}`
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setImageSize: (size: ImageSize) => ({ chain }) => {
        return chain()
          .updateAttributes('image', { size })
          .run();
      },
    };
  },
});