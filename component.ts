namespace DOM {
    export const DEFAULT = -1;
    export const INHERIT = -2;

    export enum StyleName {
        width,
        height,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        borderColor,
        borderLeft,
        borderTop,
        borderRight,
        borderBottom,
        color,
    }

    export class Style {
        readonly name: StyleName;
        value: number;
        constructor(name: StyleName, value = DEFAULT) {
            this.name = name;
            this.value = value;
        }
    }

    export class BoundingBox {
        left: number;
        top: number;
        width: number;
        height: number;
    }

    export class BoxValues {
        protected data: Buffer;

        constructor() {
            this.data = control.createBuffer(4);
        }

        get left() {
            return this.data[0];
        }

        set left(val: number) {
            this.data[0] = val & 0xff;
        }

        get top() {
            return this.data[1];
        }

        set top(val: number) {
            this.data[1] = val & 0xff;
        }

        get right() {
            return this.data[2];
        }

        set right(val: number) {
            this.data[2] = val & 0xff;
        }

        get bottom() {
            return this.data[3];
        }

        set bottom(val: number) {
            this.data[3] = val & 0xff;
        }
    }

    export class ContentBox {
        padding: BoxValues;
        border: BoxValues;
        borderColor: number;

        constructor() {
            this.padding = new BoxValues();
            this.border = new BoxValues();
            this.borderColor = 1;
        }
    }

    export class Element {
        parent: Element;
        children: Element[];
        contentBox: ContentBox;

        verticalFlow: boolean;

        width: number;
        height: number;

        _cachedWidth: number;
        _cachedHeight: number;
        _renderedBounds: BoundingBox;

        constructor() {
            this.verticalFlow = true;
            this.width = DEFAULT;
            this.height = DEFAULT;
        }

        appendChild(child: Element) {
            if (!this.children) this.children = [];
            this.children.push(child);
        }

        removeChild(child: Element) {
            if (this.children) this.children.removeElement(child);
        }


        draw() {
            if (!this._renderedBounds) {
                this.render(0, 0);
            }

            this.drawSelf(this._renderedBounds);

            if (this.children) {
                for (const child of this.children) {
                    child.draw();
                }
            }
        }

        render(left: number, top: number) {
            if (this._renderedBounds) return;

            this._renderedBounds = new BoundingBox();
            this._renderedBounds.left = left;
            this._renderedBounds.top = top;
            this._renderedBounds.width = calculateWidth(this);
            this._renderedBounds.height = calculateHeight(this);

            if (this.children) {
                if (this.verticalFlow) this.renderVerticalFlow();
                else this.renderHorizontalFlow();
            }
        }

        markDirty() {
            this._cachedWidth = undefined;
            this._cachedHeight = undefined;
            this._renderedBounds = undefined;

            if (this.children) this.children.forEach(c => c.markDirty());
        }

        applyStyles(styles: Style[]) {
            for (const style of styles) {
                this.applyStyle(style);
            }
        }

        protected renderVerticalFlow() {
            let x = this._renderedBounds.left;
            let y = this._renderedBounds.top;

            if (this.contentBox) {
                x += this.contentBox.padding.left + this.contentBox.border.left;
                y += this.contentBox.padding.top + this.contentBox.border.top;
            }

            for (const child of this.children) {
                child.render(x, y);
                y += child._renderedBounds.height;
            }
        }

        protected renderHorizontalFlow() {
            let x = this._renderedBounds.left;
            let y = this._renderedBounds.top;

            if (this.contentBox) {
                x += this.contentBox.padding.left + this.contentBox.border.left;
                y += this.contentBox.padding.top + this.contentBox.border.top;
            }

            for (const child of this.children) {
                child.render(x, y);
                x += child._renderedBounds.width;
            }
        }

        protected drawSelf(bounds: BoundingBox) {
            // subclass
        }

        private initContentBox() {
            if (!this.contentBox) this.contentBox = new ContentBox();
        }

        protected applyStyle(style: Style) {
            switch (style.name) {
                case StyleName.width: this.width = style.value; return;
                case StyleName.height: this.height = style.value; return;
                case StyleName.borderColor: this.initContentBox(); this.contentBox.borderColor = style.value; return;
                case StyleName.borderLeft: this.initContentBox(); this.contentBox.border.left = style.value; return;
                case StyleName.borderRight: this.initContentBox(); this.contentBox.border.right = style.value; return;
                case StyleName.borderTop: this.initContentBox(); this.contentBox.border.top = style.value; return;
                case StyleName.borderBottom: this.initContentBox(); this.contentBox.border.bottom = style.value; return;
                case StyleName.paddingLeft: this.initContentBox(); this.contentBox.padding.left = style.value; return;
                case StyleName.paddingRight: this.initContentBox(); this.contentBox.padding.right = style.value; return;
                case StyleName.paddingTop: this.initContentBox(); this.contentBox.padding.top = style.value; return;
                case StyleName.paddingBottom: this.initContentBox(); this.contentBox.padding.bottom = style.value; return;
            }
        }
    }

    function calculateWidth(element: Element): number {
        if (!element) return screen.width;
        else if (element._cachedWidth != undefined) return element._cachedWidth;
        else if (element.width === DEFAULT) return getDefaultWidth(element);
        else if (element.width === INHERIT) return element._cachedWidth = contentWidth(element.parent);
        else return element._cachedWidth = element.width;
    }

    function calculateHeight(element: Element): number {
        if (!element) return screen.height;
        else if (element._cachedHeight != undefined) return element._cachedHeight;
        else if (element.height === DEFAULT) return getDefaultHeight(element);
        else if (element.height === INHERIT) return element._cachedHeight = contentHeight(element.parent);
        else return element._cachedHeight = element.height;
    }

    function getDefaultWidth(element: Element) {
        if (element._cachedWidth != undefined) return element._cachedWidth;

        let childWidth = 0;

        if (element.width !== DEFAULT && element.width !== INHERIT) {
            return element._cachedWidth = element.width;
        }
        else if (element.children) {
            if (element.verticalFlow) {
                let maxWidth = 0;
                for (const child of element.children) {
                    maxWidth = Math.max(getDefaultWidth(child), maxWidth)
                }
                childWidth = maxWidth;
            }
            else {
                let totalWidth = 0;
                for (const child of element.children) {
                    totalWidth += getDefaultWidth(child);
                }
                childWidth = totalWidth;
            }

        }

        if (element.contentBox) {
            childWidth += element.contentBox.padding.left +
                element.contentBox.padding.right +
                element.contentBox.border.left +
                element.contentBox.border.right;
        }

        if (element.width === DEFAULT) {
            element._cachedWidth = childWidth;
        }

        return childWidth;
    }

    function getDefaultHeight(element: Element) {
        if (element._cachedHeight != undefined) return element._cachedHeight;

        let childHeight = 0;

        if (element.height !== DEFAULT && element.height !== INHERIT) {
            return element._cachedHeight = element.height;
        }
        else if (element.children) {
            if (element.verticalFlow) {
                let totalHeight = 0;
                for (const child of element.children) {
                    totalHeight += getDefaultHeight(child);
                }
                childHeight = totalHeight;
            }
            else {
                let maxHeight = 0;
                for (const child of element.children) {
                    maxHeight = Math.max(getDefaultHeight(child), maxHeight)
                }
                childHeight = maxHeight;
            }
        }

        if (element.contentBox) {
            childHeight += element.contentBox.padding.top +
                element.contentBox.padding.bottom +
                element.contentBox.border.top +
                element.contentBox.border.bottom;
        }

        if (element.height === DEFAULT) {
            element._cachedHeight = childHeight;
        }

        return childHeight;
    }

    function contentWidth(element: Element) {
        if (!element) return screen.width;
        else if (element.contentBox) return calculateWidth(element) -
            element.contentBox.padding.left -
            element.contentBox.padding.right -
            element.contentBox.border.left -
            element.contentBox.border.right;
        else return calculateWidth(element);
    }

    function contentHeight(element: Element) {
        if (!element) return screen.height;
        else if (element.contentBox) return calculateHeight(element) -
            element.contentBox.padding.top -
            element.contentBox.padding.bottom -
            element.contentBox.border.top -
            element.contentBox.border.bottom;
        else return calculateHeight(element);
    }
}
