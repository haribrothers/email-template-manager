import { Node, mergeAttributes, Extension } from '@tiptap/core';
import Image from '@tiptap/extension-image';

export interface ResizableImageOptions {
  inline: boolean,
  allowBase64: boolean,
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: { src: string, alt?: string, title?: string, width?: string, height?: string }) => ReturnType,
    }
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  // ... other configurations remain the same

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '200',
        parseHTML: (element) => element.style.width?.replace('px', '') || element.getAttribute('width'),
        renderHTML: (attributes) => ({
          width: attributes['width'],
          style: `width: ${attributes['width']}px`
        }),
      },
      height: {
        default: '200',
        parseHTML: (element) => element.style.height?.replace('px', '') || element.getAttribute('height'),
        renderHTML: (attributes) => ({
          height: attributes['height'],
          style: `height: ${attributes['height']}px`
        }),
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          return { style: attributes['style'] };
        },
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom: HTMLElement) => ({
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          width: dom.style.width?.replace('px', '') || dom.getAttribute('width'),
          height: dom.style.height?.replace('px', '') || dom.getAttribute('height'),
          style: dom.getAttribute('style')
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { style, ...attrs } = HTMLAttributes;
    return ['div', { class: 'resizable-image-wrapper' }, 
      ['img', mergeAttributes(this.options.HTMLAttributes, attrs, { style })],
      ['div', { class: 'resize-handle top-left' }],
      ['div', { class: 'resize-handle top-right' }],
      ['div', { class: 'resize-handle bottom-left' }],
      ['div', { class: 'resize-handle bottom-right' }],
      ['div', { class: 'resize-handle top' }],
      ['div', { class: 'resize-handle right' }],
      ['div', { class: 'resize-handle bottom' }],
      ['div', { class: 'resize-handle left' }],
    ];
  },

  // ... rest of the extension remains the same
});
