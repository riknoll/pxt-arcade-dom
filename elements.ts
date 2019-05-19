namespace DOM {
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

        constructor(text?: string) {
            super();
            this.setText(text);
            this.color = 1;
        }

        setText(text: string) {
            this.text = text;
            if (this.text) {
                this.width = this.text.length * image.font8.charWidth;
                this.height = image.font8.charHeight;
            }
            else {
                this.width = 0;
                this.height = 0;
            }

        }

        protected drawShape(bounds: BoundingBox) {
            screen.print(this.text, bounds.left, bounds.top, this.color, image.font8);
        }
    }
}