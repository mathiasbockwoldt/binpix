import { Binpic } from "./binpic";

const binpic = new Binpic();
const url = 'test.bmp';

fetch(new Request(url))
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error loading ${url}: ${response.status}`);
    }

    return response.arrayBuffer();
})
.then(array_buffer => {
    binpic.width = Number((<HTMLInputElement>document.getElementById('input_width')).value);
    binpic.zoom = Number((<HTMLInputElement>document.getElementById('input_zoom')).value);
    binpic.offset = Number((<HTMLInputElement>document.getElementById('input_offset')).value);
    binpic.load(array_buffer);
});

function upload_file(file: File): void {
    file.arrayBuffer()
    .then(response => {
        binpic.load(response);
    });
}

document.getElementById('input_file')?.addEventListener('change', (event) => {
    const files = (<HTMLInputElement>event.target).files;
    if(files && files.length === 1) {
        upload_file(files[0]);
    }
    else {
        throw new Error('No file was given for upload.');
    }
});

document.getElementById('button_update')?.addEventListener('click', binpic.update_screen);

document.getElementById('visoutput')?.addEventListener('mousemove', (event: MouseEvent) => {
    binpic.update_mouse_coordinate(event);
});

document.getElementById('visoutput')?.addEventListener('mouseout', (event: MouseEvent) => {
    binpic.update_mouse_coordinate(event);
});

document.getElementById('input_width')?.addEventListener('change', (event) => {
    binpic.update_width(Number((<HTMLInputElement>event.target).value));
});

document.getElementById('input_zoom')?.addEventListener('change', (event) => {
    binpic.update_zoom(Number((<HTMLInputElement>event.target).value));
});

document.getElementById('input_offset')?.addEventListener('change', (event) => {
    binpic.update_offset(Number((<HTMLInputElement>event.target).value));
});