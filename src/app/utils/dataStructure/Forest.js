/* @flow */
import uuidv1 from 'uuid/v1';


export default class Forest {

    nodes: Array<Object>;
    uuid: string;

    constructor(nodes: Array<Object>, uuid: ?string) {
        this.nodes = this._addUuid(nodes);
        this.uuid = uuid || uuidv1();
    };

    /**
     * Adds an uuid to all the nodes in a forest (a forest is a collection of independent tree).
     *
     * @param forest a collection of trees.
     */
    _addUuid(forest: Array<Object>): Array<Object> {
        return (forest || [])
            .filter(({ type }: Object) => type)
            .map((node: Object) => {
                if (!node.children) {
                    // the node is a leaf
                    if (!node.uuid) {
                        return { ...node, uuid: uuidv1() };
                    }
                    return node;
                }
                const nextChildren = this._addUuid(node.children);
                if (!node.uuid || nextChildren !== node.children) {
                    return {
                        ...node,
                        uuid: node.uuid || uuidv1(),
                        children: nextChildren,
                    };
                }
                return node;
            });
    };

    /**
     * Removes the uuid from all the nodes in a forest (a forest is a collection of independent tree).
     *
     * @param forest a collection of trees.
     */
    _removeUuid(forest: Array<Object>): Array<Object> {
        return (forest || [])
            .filter(({ type }: Object) => type)
            .map((node: Object) => {
                if (!node.children) {
                    // the node is a leaf
                    const { uuid, ...rest } = node;
                    return rest;
                }
                const nextChildren = this._removeUuid(node.children);
                const { uuid, ...rest } = node;
                return { ...rest, children: nextChildren };
            });
    };

    _add(currentUuid: string, elements: Array<Object>, elementToAdd: Object, parentUuid: string, index: number): Array<Object> {
        if (currentUuid === parentUuid) {
            const next = [ ...elements ];
            next.splice(index, 0, elementToAdd);
            return next;
        }
        return elements.map((element) => {
            const { type, children = [] } = element;
            if (type !== 'group' && type !== 'panel') {
                return element;
            }
            const nextChildren = this._add(element.uuid, children, elementToAdd, parentUuid, index);
            if (nextChildren === element.children) {
                return element;
            }
            return { ...element, children: nextChildren };
        });
    };

    _remove(elements: Array<Object>, uuid: string): Array<Object> {
        const next = elements.filter(element => element.uuid !== uuid);
        if (next.length !== elements.length) {
            return next;
        }
        return elements.map((element) => {
            if (!element.children) {
                return element;
            }
            const nextChildren = this._remove(element.children, uuid);
            if (nextChildren === element.children) {
                return element;
            }
            return { ...element, children: nextChildren };
        });
    };

    _update(elements: Array<Object>, updatedElement: Object): Array<Object> {
        return elements.map((element) => {
            if (updatedElement.uuid === element.uuid) {
                return updatedElement;
            }
            if (!element.children) {
                return element;
            }
            const nextChildren = this._update(element.children, updatedElement);
            if (nextChildren === element.children) {
                return element;
            }
            return { ...element, children: nextChildren };
        });
    };

    /**
     * Returns all the nodes of this forest without the UUID.
     * Every time the method is called a new forest will be generated.
     */
    getNodes() {
        return this._removeUuid(this.nodes);
    };

    add(node: Object, parentUuid: string, index: number) {
        this.nodes = this._add(this.uuid, this.nodes, {...node, uuid: node.uuid || uuidv1() }, parentUuid, index);
        return this;
    };

    remove = (element: Object) => {
        this.nodes = this._remove(this.nodes, element.uuid);
        return this;
    };

    update = (element: Object) => {
        this.nodes = this._update(this.nodes, element);
        return this;
    };

    move = (element: Object, parentUuid: string, index: number) => {
        const nodes = this._remove(this.nodes, element.uuid);
        this.nodes = this._add(this.uuid, nodes, element, parentUuid, index);
        return this;
    };

}
