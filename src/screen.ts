
export class Screen {

    bg_canvas: HTMLCanvasElement;
    bg_ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(target: string) {
        const canvas = document.getElementById(target);
        if(canvas === null || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error(`Could not find target element ${target}!`);
        }
        this.canvas = canvas;
        this.canvas.width = 640;
        this.canvas.height = 400;
        const pending_context = this.canvas.getContext('2d');
        if(pending_context === null) {
            throw new Error('Could not establish canvas 2d context!');
        }
        this.ctx = pending_context;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, 640, 400);

        this.bg_canvas = document.createElement('canvas');
        this.bg_canvas.width = 640;
        this.bg_canvas.height = 400;
        const bg_pending_context = this.bg_canvas.getContext('2d');
        if(bg_pending_context === null) {
            throw new Error('Could not establish background canvas 2d context!');
        }
        this.bg_ctx = bg_pending_context;
        this.bg_ctx.imageSmoothingEnabled = false;
    }

    render(content: ImageData, zoom: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bg_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bg_ctx.putImageData(content, 0, 0);
        this.ctx.drawImage(
            this.bg_canvas,
            0, 0,
            this.canvas.width, this.canvas.height,
            0, 0,
            this.canvas.width*zoom, this.canvas.height*zoom);
    }
}