export enum ItemEventType {
	FORCUS,
	BLUR
}

export default interface ItemEvent {
	id?: number;
	type: ItemEventType
}
