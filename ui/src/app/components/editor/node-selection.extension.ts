import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state';

export const NodeSelectionPlugin = Extension.create({
    name: 'nodeSelection',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('nodeSelection'),
                props: {
                    handleClick(view, pos) {
                        const { state } = view;
                        const node = state.doc.nodeAt(pos);

                        if (node && node.type.name === 'image') {
                            const nodeSelection = NodeSelection.create(state.doc, pos);
                            const tr = state.tr.setSelection(nodeSelection);
                            view.dispatch(tr);

                            const el = view.nodeDOM(pos);
                            if (el) {
                                (el as HTMLElement).classList.add('selected-node');
                            }
                            return true;
                        }

                        view.dom.querySelectorAll('img.selected-node').forEach(img => {
                            img.classList.remove('selected-node');
                        });

                        return false;
                    },
                },
            }),
        ];
    },
});