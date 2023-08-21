import { Color } from '../config';
import { Canvas } from './viewport';


export enum RectType {
    CELL = 'cell',
    OPTION = 'option',
    ROLL = 'roll',
    CONT = 'cont',
}

export enum RectOption {
    '1st12' = '1st12',
    '2st12' = '2st12',
    '3st12' = '3st12',
    '1>18' = '1>18',
    '19>36' = '19>36',
    '1_line' = '1_line',
    '2_line' = '2_line',
    '3_line' = '3_line',
    'even' = 'even',
    'odd' = 'odd',
    'red' = 'red',
    'black' = 'black',
    'cell' = 'cell',
    'button' = 'button',
}

export interface Param {
    name: string,
    type: RectType,
    option: RectOption,
    background?: Color,
    borderColor?: Color,
    borderWidth?: number,
    board?: Canvas,
}

export class Rect {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly w: number,
        public readonly h: number,
        public readonly param: Param
    ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.param = param;
    }
    clone(withParam?: Partial<Param>):Rect {
        const params: Param = Object.assign({}, this.param);
        const keys = Object.keys(withParam)
        // rewrite only styles at first, all @TODO
        if (keys.includes('background')) {params.background = withParam.background;}
        if (keys.includes('borderColor')) {params.borderColor = withParam.borderColor;}
        if (keys.includes('borderWidth')) {params.borderWidth = withParam.borderWidth;}
        return (new Rect(
            this.x,
            this.y,
            this.w,
            this.h,
            params
        ));
    }
    private getBoard(onBoard:Canvas):Canvas {
        const { board } = this.param;
        if(onBoard) {
            return onBoard;
        }
        if(board) {
            return board;
        }
        throw new Error(`No active board on rect name: "${this.param.name}"`)
    }
    drawRect(onBoard?: Canvas):Rect {
        const {
            background,
            borderColor,
            borderWidth,
        } = this.param;
        const { ctx } = this.getBoard(onBoard);
        const { x, y, w, h } = this;

        ctx.beginPath();
        if(borderWidth && borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(x, y, w, h);
            ctx.stroke();
        }
        if(background) {
            ctx.rect(x, y, w, h);
            ctx.fillStyle = background;
            ctx.fill();
        }
        ctx.closePath();
        return this;
    }
    drawText(onBoard?: Canvas, fontSize:number = 36):Rect {
        const { ctx } = this.getBoard(onBoard);

        const x = this.x + this.w/2 - fontSize/3.3 * this.param.name.length;

        // with descent
        // const y = this.y + this.h/2 + fontSize/3.9;

        // without descent
        const y = this.y + this.h/2 + fontSize/3;

        ctx.beginPath();
        ctx.font = `${fontSize}px Courier New`;
        ctx.fillStyle = 'white';
        ctx.fillText(this.param.name, x, y);
        ctx.closePath();
        ctx.fill();
        return this;
    }
    draw(onBoard?:Canvas):Rect {
        const board = this.getBoard(onBoard);
        this.drawRect(board);
        this.drawText(board);
        return this;
    }
}
