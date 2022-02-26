import React from "react";
import Item from "./Item/Item";
import PubSub from "pubsub-js";
import {TOPIC_CHANGE_ITEM, TOPIC_ITEM_EVENT} from "../../../config/Constant";
import TodoEvent, {TodoEventType} from "../Form/TodoEvent";
import TodoDTO from "./TodoDTO";
import {renderIf} from "../../../Utils/Supports";
import ItemEvent, {ItemEventType} from "./Item/ItemEvent";

import './List.css'

let ID = 0;

class List extends React.Component {
	tokenChangeItem: any;
	tokenItemEvent: any;

	state = {
		list: [],
		blur: false
	}

	componentDidMount() {
		this.tokenChangeItem = PubSub.subscribe(TOPIC_CHANGE_ITEM, this.onChangeItem);
		this.tokenItemEvent = PubSub.subscribe(TOPIC_ITEM_EVENT, this.onItemEvent);
	}

	componentWillUnmount() {
		PubSub.unsubscribe(this.tokenChangeItem);
		PubSub.unsubscribe(this.tokenItemEvent);
	}

	onChangeItem = (topic: string, event: TodoEvent) => {
		switch (event.type) {
			case TodoEventType.ADD:
				let todo: TodoDTO = {
					id: ++ID,
					text: event.text,
					color: event.color,
				}
				let list = [todo, ...this.state.list]
				this.setState({list: list})
				break;

			case TodoEventType.UPDATE:
				break;

			case TodoEventType.REMOVE:
				let id = event.id;
				let list2 = this.state.list;
				for (let i = 0; i < list2.length; i++) {
					// @ts-ignore
					if (list2[i].id === id) {
						list2.splice(i, 1);
						break;
					}
				}
				this.setState({list: list2, blur: false})
				break;

		}
	}

	onItemEvent = (topic: string, event: ItemEvent) => {
		switch (event.type) {
			case ItemEventType.FORCUS:
				this.setState({blur: true})
				break;

			case ItemEventType.BLUR:
				this.setState({blur: false})
				break;
		}
	}

	renderItem(todo: any) {
		return (
			<Item todo={todo}/>
		);
	}

	render() {
		const {list, blur} = this.state;

		return (
			<>
				{renderIf(blur)(
					<div className="background"/>
				)}
				<div>
					{list.map(this.renderItem)}
				</div>
			</>
		);
	}
}

export default List;
