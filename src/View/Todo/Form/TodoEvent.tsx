export enum TodoEventType {
	ADD,
	UPDATE,
	REMOVE
}

export default interface TodoEvent {
	text: string;
	color: string;
	type: TodoEventType;
}
