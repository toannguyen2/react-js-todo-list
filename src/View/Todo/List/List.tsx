import React from "react";
import Item from "./Item/Item";
import PubSub from "pubsub-js";
import {TOPIC_CHANGE_ITEM} from "../../../config/Constant";
import TodoEvent, {TodoEventType} from "../Form/TodoEvent";
import TodoDTO from "./TodoDTO";

let ID = 0;

class List extends React.Component {
	tokenChangeItem: any;

	state = {
		list: []
	}

	componentDidMount() {
		this.tokenChangeItem = PubSub.subscribe(TOPIC_CHANGE_ITEM, this.onChangeItem);
	}

	componentWillUnmount() {
		PubSub.unsubscribe(this.tokenChangeItem);
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
				this.setState({list: list2})


				break;

		}
	}

	renderItem(todo: any) {
		return (
			<Item todo={todo}/>
		);
	}

	render() {
		const {list} = this.state;

		return (
			<div>
				{list.map(this.renderItem)}
			</div>
		);
	}
}

export default List;
