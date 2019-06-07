namespace ui {
    export class ShapeElement extends Element {
        color: number;

        constructor() {
            super();

            this.color = 0;
        }

        protected drawSelf(bounds: BoundingBox) {
            if (this.color) this.drawShape(bounds);
        }

        protected drawShape(bounds: BoundingBox) {
            screen.drawRect(bounds.left, bounds.top, bounds.width, bounds.height, this.color);
        }

        applyStyle(style: Style) {
            if (style.name === StyleName.color) {
                this.color = style.value
            }
            else {
                super.applyStyle(style);
            }
        }
    }

    export class BoxElement extends ShapeElement {
        protected drawShape(bounds: BoundingBox) {
            screen.fillRect(bounds.left, bounds.top, bounds.width, bounds.height, this.color);
        }
    }

    export class TextElement extends ShapeElement {
        text: string;
        font: Font;

        constructor(text?: string) {
            super();
            this.setText(text);
            this.color = 15;
            this.font = Font.Normal;
        }

        setText(text: string) {
            this.text = text;
            this.updateBounds();
        }

        applyStyle(style: Style) {
            if (style.name === StyleName.font) {
                this.font = style.value;
                this.updateBounds();
            }
            else {
                super.applyStyle(style);
            }
        }

        protected updateBounds() {
            const f = this.renderFont();
            this.height = f.charHeight;
            if (this.text) {
                this.width = this.text.length * f.charWidth;
            }
            else {
                this.width = 0;
            }
        }

        protected drawShape(bounds: BoundingBox) {
            screen.print(this.text, bounds.left, bounds.top, this.color, this.renderFont());
        }

        protected renderFont() {
            if (this.font === Font.Small) {
                return image.font5
            }
            return image.font8;
        }
    }

    export class ImageElement extends Element {
        protected src: Image;

        constructor(src: Image) {
            super();

            this.src = src;
        }

        protected drawSelf(bounds: BoundingBox) {
            screen.drawTransparentImage(this.src, bounds.left, bounds.top);
        }
    }

    export class DynamicElement extends Element {
        protected drawFunction: (bounds: BoundingBox) => void;

        constructor(drawFunction: (bounds: BoundingBox) => void) {
            super();
            this.drawFunction = drawFunction;
        }

        protected drawSelf(bounds: BoundingBox) {
            this.drawFunction(bounds);
        }
    }
}