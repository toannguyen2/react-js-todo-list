import React from 'react';
import './TodoForm.css'
import ColorItem from "./ColorItem/ColorItem";
import {renderIf} from "../../../Utils/Supports";
import PubSub from "pubsub-js";
import {
	COLORS,
	COLORS_DEFAULT,
	TOPIC_CHANGE_ITEM,
	TOPIC_COLOR_CHANGE,
	TOPIC_ITEM_EVENT
} from "../../../config/Constant";
import ColorItemEvent from "./ColorItem/ColorItemEvent";
import TodoEvent, {TodoEventType} from "./TodoEvent";

class TodoForm extends React.Component {
	tokenColorChange: any;
	tokenItemEvent: any

	state = {
		value: "",
		color: COLORS_DEFAULT,
		showColor: false,
	}

	componentDidMount() {
		this.tokenColorChange = PubSub.subscribe(TOPIC_COLOR_CHANGE, this.onColorChange);
		this.tokenItemEvent = PubSub.subscribe(TOPIC_ITEM_EVENT, this.onItemEvent);
	}

	componentWillUnmount() {
		PubSub.unsubscribe(this.tokenColorChange);
	}

	onColorChange = (topic: string, event: ColorItemEvent) => {
		if (!!event.todoId)
			return;

		this.setState({color: event.color})
	}
	onItemEvent = () => {
		this.setState({showColor: false})
	}

	toggleColor = () => {
		this.setState({showColor: !this.state.showColor})
	}

	handleInput = (event: any) => {
		this.setState({value: event.target.value})
	}

	onAdd = (event: any) => {
		if (!this.state.value.trim())
			return;

		let todoEvent: TodoEvent = {
			text: this.state.value,
			color: this.state.color,
			type: TodoEventType.ADD
		}

		PubSub.publish(TOPIC_CHANGE_ITEM, todoEvent);

		this.setState({
			color: COLORS_DEFAULT,
			value: "",
			showColor: false
		})
	}

	renderColor = (color: any) => {
		return (
			<ColorItem key={color} color={color}/>
		);
	}

	render() {
		const {value, color, showColor} = this.state;

		return (
			<div className="todo_form">
				<div className="container_input">
					<div className="box">
						<input type="text" value={value} onInput={this.handleInput}/>
						<div className="color_btn">
							<div className="color_btn" onClick={this.toggleColor}>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
									 xmlns="http://www.w3.org/2000/svg">
									<path
										d="M16.0631 11.5195C15.974 11.5825 14.1261 13.5691 14.1261 14.9634C14.1261 16.4335 15.0452 17.3722 16.0631 17.4234C16.9405 17.4667 18 16.5467 18 14.9634C18 13.4875 16.1522 11.5825 16.0631 11.5195ZM5.9774 17.4234C6.34348 17.7953 6.82966 18 7.34682 18C7.86398 18 8.35016 17.7953 8.71624 17.4234L15.4955 10.5355L14.8108 9.83983L7.34682 2.25627L5.12612 0L3.7567 1.39135L5.9774 3.64762L0.567524 9.14415C0.201442 9.5161 0 10.0101 0 10.5355C0 11.061 0.201442 11.5549 0.567524 11.9269L5.9774 17.4234ZM7.34682 5.03898L12.7567 10.5355H1.93694L7.34682 5.03898Z"
										fill={color}/>
								</svg>
							</div>
							{renderIf(showColor)(
								<div className="color-container">
									{COLORS.map(this.renderColor)}
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="todo_btn_add" onClick={this.onAdd}>
					Add
				</div>
			</div>
		);
	}
}

export default TodoForm;
