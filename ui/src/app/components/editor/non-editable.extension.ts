import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nonEditable: {
      setNonEditable: () => ReturnType;
      unsetNonEditable: () => ReturnType;
    };
  }
}

export const NonEditable = Extension.create({
  name: 'nonEditable',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          editable: {
            default: true,
            parseHTML: element => element.getAttribute('contenteditable') !== 'false',
            renderHTML: attributes => {
              if (!attributes['editable']) {
                return {
                  'contenteditable': 'false',
                  'class': 'non-editable'
                };
              }
              return {};
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setNonEditable: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { editable: false })
          .run();
      },
      unsetNonEditable: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { editable: true })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});