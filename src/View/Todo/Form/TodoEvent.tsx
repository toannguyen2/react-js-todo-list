export enum TodoEventType {
	ADD,
	UPDATE,
	REMOVE
}

export default interface TodoEvent {
	id?: number;
	text?: string;
	color?: string;
	type: TodoEventType;
}
