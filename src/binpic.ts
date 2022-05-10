import { getCursorPosition } from "./helper";
import { Screen } from "./screen";

export class Binpic {

    screen: Screen;
    content_buffer: ArrayBuffer;
    content: Uint8ClampedArray;
    image_data: ImageData;
    output: HTMLOutputElement;
    bits = 8;
    zoom = 1;
    width = 64;
    offset = 0;

    constructor() {
        this.screen = new Screen('visoutput');
        this.content_buffer = new ArrayBuffer(4);
        this.content = new Uint8ClampedArray(this.content_buffer);
        this.image_data = new ImageData(this.content, 1);
        const output = document.getElementById('output_coord');
        if(output === null || !(output instanceof HTMLOutputElement)) {
            throw new Error('No output element found!');
        }
        this.output = output;
    }

    update_screen(): void {
        this.screen.render(this.image_data, this.zoom);
    }

    update_content(): void {
        /*switch (this.bits) {
            case 8:
                this.content = new Uint8Array(this.content_buffer);
                break;
        
            default:
                throw new Error(`${this.bits} Bits is invalid.`);
        }*/

        const orig_array = new Uint8Array(this.content_buffer.slice(this.offset));

        const content_length = Math.ceil(orig_array.length / this.width) * this.width * 4;
        this.content = new Uint8ClampedArray(content_length);

        // This seems horribly inefficient. I guess there should be some way
        // to let the gfx card do the work, but I don't know how.

        for(let i = 0; i < orig_array.length; i++) {
            this.content[i*4] = orig_array[i];
            this.content[i*4+1] = orig_array[i];
            this.content[i*4+2] = orig_array[i];
            this.content[i*4+3] = 255;
        }

        this.image_data = new ImageData(this.content, this.width);

        this.update_screen();
    }

    update_width(width: number) {
        this.width = width;
        this.update_content();
    }

    update_zoom(zoom: number) {
        this.zoom = zoom;
        this.update_screen();
    }

    update_offset(offset: number) {
        this.offset = offset;
        this.update_content();
    }

    load(content: ArrayBuffer): void {
        this.content_buffer = content;
        this.update_content();
    }

    update_mouse_coordinate(event: MouseEvent): void {
        const [x, y]: number[] = getCursorPosition(this.screen.canvas, event);

        if(x < 0 || y < 0 || y > 400 || x > this.width * this.zoom) {
            this.output.value = '';
            return;
        }

        const file_position = this.offset + Math.floor(x / this.zoom) + Math.floor(y / this.zoom) * this.width;

        this.output.value = `${file_position} 0x${file_position.toString(16).toUpperCase()}`;
    }
}

