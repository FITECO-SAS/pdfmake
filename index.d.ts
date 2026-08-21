import type {
	BufferOptions,
	CustomTableLayout,
	TDocumentDefinitions,
	TFontDictionary,
} from './interfaces';

export * from './interfaces';

export interface TCreatedPdf {
	getStream(): Promise<NodeJS.ReadableStream>;
	getBuffer(): Promise<Buffer>;
	getBase64(): Promise<string>;
	getDataUrl(): Promise<string>;
	write(filename: string): Promise<void>;
}

export interface PdfMake {
	createPdf(docDefinition: TDocumentDefinitions, options?: BufferOptions): TCreatedPdf;
	setFonts(fonts: TFontDictionary): void;
	addFonts(fonts: TFontDictionary): void;
	clearFonts(): void;
	setTableLayouts(tableLayouts: { [name: string]: CustomTableLayout }): void;
	addTableLayouts(tableLayouts: { [name: string]: CustomTableLayout }): void;
	clearTableLayouts(): void;
	setProgressCallback(callback: (progress: number) => void): void;
	setUrlAccessPolicy(callback?: (url: string) => boolean): void;
	setLocalAccessPolicy(callback?: (path: string) => boolean): void;
}

declare const pdfmake: PdfMake;

export default pdfmake;
