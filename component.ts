namespace DOM {
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
        align: ContentAlign;
        borderColor: number;

        constructor() {
            this.padding = new BoxValues();
            this.border = new BoxValues();
            this.borderColor = 1;
            this.align = ContentAlign.Center;
        }

        getElementBounds(left: number, top: number, outerWidth: number, outerHeight: number) {
            const r = new BoundingBox();
            r.left = left + this.border.left;
            r.top = top + this.border.top;
            r.width = outerWidth - this.border.left - this.border.right;
            r.height = outerHeight - this.border.top - this.border.bottom;
            return r;
        }

        getContentBounds(element: BoundingBox, contentWidth: number, contentHeight: number) {
            const r = new BoundingBox();
            r.top = element.top + this.padding.top;
            r.width = contentWidth;
            r.height = contentHeight;

            switch (this.align) {
                case ContentAlign.Left:
                    r.left = element.left + this.padding.left;
                    break;
                case ContentAlign.Center:
                    r.left = element.left + (element.width >> 1) - (contentWidth >> 1);
                    break;
                case ContentAlign.Right:
                    r.left = (element.left + element.width - this.padding.right - contentWidth);
                    break;
            }

            return r;
        }
    }

    export class Element {
        parent: Element;
        children: Element[];
        contentBox: ContentBox;

        className: string;
        sheet: StyleSheet;

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
            this.contentBox = new ContentBox();
        }

        appendChild(child: Element) {
            if (!this.children) this.children = [];

            if (child.parent) {
                child.parent.removeChild(child);
            }

            child.parent = this;
            this.children.push(child);
        }

        removeChild(child: Element) {
            if (this.children) this.children.removeElement(child);
        }


        draw() {
            if (!this._renderedBounds) {
                this.render();
            }

            this.drawSelf(this._renderedBounds);

            if (this.children) {
                for (const child of this.children) {
                    child.draw();
                }
            }
        }

        render(bounds?: BoundingBox) {
            if (this._renderedBounds) return;

            if (bounds) {
                this._renderedBounds = this.contentBox.getElementBounds(bounds.left, bounds.top, bounds.width, bounds.height)
            }
            else {
                this._renderedBounds = this.contentBox.getElementBounds(0, 0, calculateWidth(this), calculateHeight(this));
            }

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
            let y = this._renderedBounds.top + this.contentBox.padding.top + this.contentBox.border.top;

            let current: BoundingBox;

            for (const child of this.children) {
                current = this.contentBox.getContentBounds(this._renderedBounds, calculateWidth(child), calculateHeight(child));
                current.top = y;
                child.render(current);
                y += current.height;
            }
        }

        protected renderHorizontalFlow() {
            let x = this._renderedBounds.left + this.contentBox.padding.left + this.contentBox.border.left;
            let current: BoundingBox;

            for (const child of this.children) {
                current = this.contentBox.getContentBounds(this._renderedBounds, calculateWidth(child), calculateHeight(child));
                current.left = x;
                child.render(current);

                x += current.width;
            }
        }

        protected drawSelf(bounds: BoundingBox) {
            // subclass
        }

        protected applyStyle(style: Style) {
            switch (style.name) {
                case StyleName.width: this.width = style.value; return;
                case StyleName.height: this.height = style.value; return;
                case StyleName.borderColor: this.contentBox.borderColor = style.value; return;
                case StyleName.borderLeft: this.contentBox.border.left = style.value; return;
                case StyleName.borderRight: this.contentBox.border.right = style.value; return;
                case StyleName.borderTop: this.contentBox.border.top = style.value; return;
                case StyleName.borderBottom: this.contentBox.border.bottom = style.value; return;
                case StyleName.contentAlign: this.contentBox.align = style.value; break;
                case StyleName.paddingLeft: this.contentBox.padding.left = style.value; return;
                case StyleName.paddingRight: this.contentBox.padding.right = style.value; return;
                case StyleName.paddingTop: this.contentBox.padding.top = style.value; return;
                case StyleName.paddingBottom: this.contentBox.padding.bottom = style.value; return;
                case StyleName.padding:
                    this.contentBox.padding.left = style.value;
                    this.contentBox.padding.right = style.value;
                    this.contentBox.padding.top = style.value;
                    this.contentBox.padding.bottom = style.value;
                    break;
                case StyleName.border:
                    this.contentBox.border.left = style.value;
                    this.contentBox.border.right = style.value;
                    this.contentBox.border.top = style.value;
                    this.contentBox.border.bottom = style.value;
                    break;
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

        childWidth += element.contentBox.padding.left +
            element.contentBox.padding.right +
            element.contentBox.border.left +
            element.contentBox.border.right;

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

        childHeight += element.contentBox.padding.top +
            element.contentBox.padding.bottom +
            element.contentBox.border.top +
            element.contentBox.border.bottom;

        if (element.height === DEFAULT) {
            element._cachedHeight = childHeight;
        }

        return childHeight;
    }

    function contentWidth(element: Element) {
        if (!element) return screen.width;
        else return calculateWidth(element) -
            element.contentBox.padding.left -
            element.contentBox.padding.right -
            element.contentBox.border.left -
            element.contentBox.border.right;
    }

    function contentHeight(element: Element) {
        if (!element) return screen.height;
        else return calculateHeight(element) -
            element.contentBox.padding.top -
            element.contentBox.padding.bottom -
            element.contentBox.border.top -
            element.contentBox.border.bottom;
    }
}
