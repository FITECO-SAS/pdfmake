/**
 * Document-definition types for @myfiteco/pdfmake (pdfmake 0.3 + custom `isFooter`).
 * Compatible with the usual `@types/pdfmake` names (`TDocumentDefinitions`, `Content`, …).
 */

export type PageSize =
	| '4A0' | '2A0' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'A9' | 'A10'
	| 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'B10'
	| 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'C10'
	| 'RA0' | 'RA1' | 'RA2' | 'RA3' | 'RA4'
	| 'SRA0' | 'SRA1' | 'SRA2' | 'SRA3' | 'SRA4'
	| 'EXECUTIVE' | 'FOLIO' | 'LEGAL' | 'LETTER' | 'TABLOID'
	| PredefinedPageSize
	| CustomPageSize;

export interface PredefinedPageSize {
	width: number;
	height: 'auto';
}

export interface CustomPageSize {
	width: number;
	height: number;
}

export type PageOrientation = 'portrait' | 'landscape';
export type PageBreak = 'before' | 'after' | 'beforeEven' | 'afterEven' | 'beforeOdd' | 'afterOdd';
export type Alignment = 'left' | 'right' | 'justify' | 'center';
export type Decoration = 'underline' | 'lineThrough' | 'overline';
export type DecorationStyle = 'dashed' | 'dotted' | 'double' | 'wavy';

export type Margins = number | [number, number] | [number, number, number, number];

export type Size =
	| number
	| 'auto'
	| '*'
	| string;

export interface Position {
	x?: number;
	y?: number;
}

export interface Style {
	font?: string;
	fontSize?: number;
	fontFeatures?: string[];
	lineHeight?: number;
	bold?: boolean;
	italics?: boolean;
	alignment?: Alignment;
	color?: string;
	background?: string;
	markerColor?: string;
	decoration?: Decoration | Decoration[];
	decorationStyle?: DecorationStyle;
	decorationColor?: string;
	characterSpacing?: number;
	leadingIndent?: number;
	preserveLeadingSpaces?: boolean;
	opacity?: number;
	fillOpacity?: number;
	sup?: boolean;
	sub?: boolean;
}

export type StyleReference = string | string[] | Style | Array<string | Style>;

export interface StyleDictionary {
	[name: string]: Style;
}

/**
 * Properties shared by every content node.
 *
 * `isFooter` is a MyFiteco fork option (not upstream pdfmake).
 */
export interface ContentBase extends Style {
	style?: StyleReference;
	margin?: Margins;
	marginLeft?: number;
	marginTop?: number;
	marginRight?: number;
	marginBottom?: number;
	absolutePosition?: Position;
	relativePosition?: Position;
	pageBreak?: PageBreak;
	pageOrientation?: PageOrientation;
	headlineLevel?: number;
	unbreakable?: boolean;
	tocItem?: boolean | string | string[];
	tocStyle?: StyleReference;
	tocMargin?: Margins;
	id?: string;
	/**
	 * Stick this node to the bottom of the usable page area.
	 * Not an official pdfmake option — see README.
	 */
	isFooter?: boolean;
}

export interface ContentText extends ContentBase {
	text: string | Content | Array<string | Content>;
	preserveLeadingSpaces?: boolean;
	preserveTrailingSpaces?: boolean;
	link?: string;
	linkToPage?: number;
	linkToDestination?: string;
}

export interface ContentColumns extends ContentBase {
	columns: Content[];
	columnGap?: number;
	snakingColumns?: boolean;
}

export interface ContentStack extends ContentBase {
	stack: Content[];
}

export interface ContentUnorderedList extends ContentBase {
	ul: Content[];
	type?: string;
	markerColor?: string;
}

export interface ContentOrderedList extends ContentBase {
	ol: Content[];
	type?: string;
	separator?: string | [string, string];
	reversed?: boolean;
	start?: number;
	markerColor?: string;
}

export type TableCell = Content | Content[] | undefined | null;

export interface TableLayoutFunctions {
	hLineWidth?: (i: number, node: ContentTable) => number;
	vLineWidth?: (i: number, node: ContentTable) => number;
	hLineColor?: (i: number, node: ContentTable, columnIndex?: number) => string;
	vLineColor?: (i: number, node: ContentTable, rowIndex?: number) => string;
	hLineStyle?: (i: number, node: ContentTable) => object | null;
	vLineStyle?: (i: number, node: ContentTable) => object | null;
	paddingLeft?: (i: number, node: ContentTable) => number;
	paddingRight?: (i: number, node: ContentTable) => number;
	paddingTop?: (i: number, node: ContentTable) => number;
	paddingBottom?: (i: number, node: ContentTable) => number;
	fillColor?: (rowIndex: number, node: ContentTable, columnIndex: number) => string | null;
	fillOpacity?: (rowIndex: number, node: ContentTable, columnIndex: number) => number | null;
	defaultBorder?: boolean;
}

export type CustomTableLayout = TableLayoutFunctions | string;

export interface Table {
	body: TableCell[][];
	widths?: Size[] | string;
	heights?: number | number[] | ((row: number) => number | 'auto');
	headerRows?: number;
	keepWithHeaderRows?: number | boolean;
	dontBreakRows?: boolean;
	layout?: CustomTableLayout;
}

export interface ContentTable extends ContentBase {
	table: Table;
	layout?: CustomTableLayout;
}

export interface ContentImage extends ContentBase {
	image: string;
	width?: number;
	height?: number;
	fit?: [number, number];
	cover?: { width: number; height: number; valign?: string; align?: string };
}

export interface ContentSvg extends ContentBase {
	svg: string;
	width?: number;
	height?: number;
	fit?: [number, number];
}

export interface ContentQr extends ContentBase {
	qr: string;
	foreground?: string;
	version?: number;
	eccLevel?: string;
	mode?: string;
	fit?: number;
}

export interface ContentCanvas extends ContentBase {
	canvas: CanvasElement[];
}

export interface ContentToc extends ContentBase {
	toc: TableOfContent;
}

export interface TableOfContent {
	title?: Content;
	textStyle?: StyleReference;
	numberStyle?: StyleReference;
	id?: string;
}

export interface ContentAnchor extends ContentBase {
	text: string | Content;
}

export interface ContentPageReference extends ContentBase {
	pageReference: string;
}

export interface ContentTextReference extends ContentBase {
	textReference: string;
}

export interface ContentAttachment extends ContentBase {
	attachment: string;
}

export interface ContentSection extends ContentBase {
	section: Content;
	pageSize?: PageSize | 'inherit';
	pageOrientation?: PageOrientation | 'inherit';
	pageMargins?: Margins | 'inherit';
	header?: DynamicContent | Content | null | 'inherit';
	footer?: DynamicContent | Content | null | 'inherit';
	background?: DynamicBackground | Content | null | 'inherit';
	watermark?: Watermark | string | null | 'inherit';
}

export type CanvasElement =
	| CanvasRect
	| CanvasLine
	| CanvasPolyline
	| CanvasEllipse;

export interface CanvasLineElement {
	type: string;
	lineColor?: string;
	lineWidth?: number;
	lineCap?: string;
	dash?: { length: number; space?: number };
}

export interface CanvasRect extends CanvasLineElement {
	type: 'rect';
	x: number;
	y: number;
	w: number;
	h: number;
	r?: number;
	color?: string;
	fillOpacity?: number;
	linearGradient?: string[];
}

export interface CanvasLine extends CanvasLineElement {
	type: 'line';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface CanvasPolyline extends CanvasLineElement {
	type: 'polyline';
	points: Array<{ x: number; y: number }>;
	closePath?: boolean;
	color?: string;
	fillOpacity?: number;
}

export interface CanvasEllipse extends CanvasLineElement {
	type: 'ellipse';
	x: number;
	y: number;
	r1: number;
	r2: number;
	color?: string;
	fillOpacity?: number;
}

export type Content =
	| string
	| number
	| Content[]
	| ContentText
	| ContentColumns
	| ContentStack
	| ContentUnorderedList
	| ContentOrderedList
	| ContentTable
	| ContentImage
	| ContentSvg
	| ContentQr
	| ContentCanvas
	| ContentToc
	| ContentAnchor
	| ContentPageReference
	| ContentTextReference
	| ContentAttachment
	| ContentSection;

export interface Node {
	id?: string;
	text?: string | Content;
	ul?: Content[];
	ol?: Content[];
	table?: Table;
	image?: string;
	qr?: string;
	canvas?: CanvasElement[];
	svg?: string;
	columns?: Content[];
	headlineLevel?: number;
	style?: StyleReference;
	pageBreak?: PageBreak;
	pageOrientation?: PageOrientation;
	pageNumbers: number[];
	pages: number;
	stack: boolean;
	startPosition: {
		pageNumber: number;
		pageOrientation: PageOrientation;
		left: number;
		right?: number;
		verticalRatio: number;
		horizontalRatio: number;
	};
}

export type DynamicContent = (
	currentPage: number,
	pageCount: number,
	pageSize: ContextPageSize
) => Content | null | undefined;

export type DynamicBackground = (
	currentPage: number,
	pageSize: ContextPageSize
) => Content | null | undefined;

export interface ContextPageSize {
	width: number;
	height: number;
	orientation: PageOrientation;
}

export type PageBreakBeforeFunction = (
	currentNode: Node,
	followingNodesOnPage?: Node[],
	nodesOnNextPage?: Node[],
	previousNodesOnPage?: Node[]
) => boolean;

export interface Watermark {
	text: string;
	font?: string;
	color?: string;
	opacity?: number;
	bold?: boolean;
	italics?: boolean;
	fontSize?: number | 'auto';
	angle?: number;
}

export interface TDocumentInformation {
	title?: string;
	author?: string;
	subject?: string;
	keywords?: string;
	creator?: string;
	producer?: string;
	creationDate?: Date;
	modDate?: Date;
}

export interface PDFKitPermissions {
	printing?: 'lowResolution' | 'highResolution';
	modifying?: boolean;
	copying?: boolean;
	annotating?: boolean;
	fillingForms?: boolean;
	contentAccessibility?: boolean;
	documentAssembly?: boolean;
}

export interface TDocumentDefinitions {
	content: Content;
	background?: DynamicBackground | Content;
	compress?: boolean;
	defaultStyle?: Style;
	footer?: DynamicContent | Content;
	header?: DynamicContent | Content;
	images?: { [key: string]: string };
	info?: TDocumentInformation;
	pageBreakBefore?: (
		currentNode: Node,
		followingNodesOnPage: Node[],
		nodesOnNextPage: Node[],
		previousNodesOnPage: Node[]
	) => boolean;
	pageMargins?: Margins;
	pageOrientation?: PageOrientation;
	pageSize?: PageSize;
	styles?: StyleDictionary;
	userPassword?: string;
	ownerPassword?: string;
	permissions?: PDFKitPermissions;
	watermark?: string | Watermark;
	language?: string;
	version?: string;
	subset?: string;
	tagged?: boolean;
	displayTitle?: boolean;
	attachments?: { [key: string]: unknown };
	patterns?: { [key: string]: unknown };
}

export interface BufferOptions {
	fontLayoutCache?: boolean;
	bufferPages?: boolean;
	tableLayouts?: { [name: string]: CustomTableLayout };
}

export interface TFontFamilyTypes {
	normal?: string;
	bold?: string;
	italics?: string;
	bolditalics?: string;
}

export interface TFontDictionary {
	[fontName: string]: TFontFamilyTypes;
}
