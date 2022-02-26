import React from "react";
import "./Item.css"
import TodoEvent, {TodoEventType} from "../../Form/TodoEvent";
import PubSub from "pubsub-js";
import {COLORS, TOPIC_CHANGE_ITEM, TOPIC_COLOR_CHANGE, TOPIC_ITEM_EVENT} from "../../../../config/Constant";
import ItemEvent, {ItemEventType} from "./ItemEvent";
import {renderIf} from "../../../../Utils/Supports";
import ColorItem from "../../Form/ColorItem/ColorItem";
import ColorItemEvent from "../../Form/ColorItem/ColorItemEvent";

class Item extends React.Component<any> {
	tokenItemEvent: any;
	tokenColorChange: any;
	input: any

	textUpdate = ""
	colorUpdate = ""

	state = {
		blur: false,
		needUpdate: false,
		text: "",
		color: "",
		showColor: false
	}

	componentDidMount() {
		this.tokenItemEvent = PubSub.subscribe(TOPIC_ITEM_EVENT, this.onItemEvent);
		this.tokenColorChange = PubSub.subscribe(TOPIC_COLOR_CHANGE, this.onColorChange);

		this.textUpdate = this.props.todo.text
		this.colorUpdate = this.props.todo.color

		this.setState({
			text: this.textUpdate,
			color: this.colorUpdate,
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe(this.tokenItemEvent);
		PubSub.unsubscribe(this.tokenColorChange);
	}

	onItemEvent = (topic: string, event: ItemEvent) => {
		switch (event.type) {
			case ItemEventType.FORCUS:
				if (event.id !== this.props.todo.id) {
					this.setState({blur: true})
				}
				break;

			case ItemEventType.BLUR:
				if (event.id !== this.props.todo.id) {
					this.setState({blur: false})
				}
				break;
		}
	}

	onColorChange = (topic: string, event: ColorItemEvent) => {
		if (!!event.todoId && event.todoId === this.props.todo.id) {
			this.setState({color: event.color})
		}
	}

	onRemove = () => {
		let todoEvent: TodoEvent = {
			id: this.props.todo.id,
			type: TodoEventType.REMOVE
		}

		PubSub.publish(TOPIC_CHANGE_ITEM, todoEvent);
	}

	onFocus = () => {
		let itemEvent: ItemEvent = {
			id: this.props.todo.id,
			type: ItemEventType.FORCUS
		}

		this.setState({needUpdate: true})

		PubSub.publish(TOPIC_ITEM_EVENT, itemEvent);
	}

	onEdit = () => {
		this.input.focus();
	}
	onNoEdit = () => {
		this.setState({
			needUpdate: false,
			text: this.textUpdate,
			color: this.colorUpdate,
		})

		let itemEvent: ItemEvent = {
			id: this.props.todo.id,
			type: ItemEventType.BLUR
		}

		PubSub.publish(TOPIC_ITEM_EVENT, itemEvent);
		this.setState({showColor: false});
	}

	onUpdate = () => {
		this.textUpdate = this.state.text
		this.colorUpdate = this.state.color

		let itemEvent: ItemEvent = {
			id: this.props.todo.id,
			type: ItemEventType.BLUR
		}

		PubSub.publish(TOPIC_ITEM_EVENT, itemEvent);
		this.setState({needUpdate: false, showColor: false});
	}

	toggleColor = () => {
		this.setState({showColor: !this.state.showColor});
	}


	refInput = (input: any) => {
		this.input = input
	}

	handleInput = (event: any) => {
		this.setState({text: event.target.value})
	}

	renderColor = (color: any) => {
		return (
			<ColorItem key={color} color={color} todoId={this.props.todo.id}/>
		);
	}

	render() {
		const {blur, text, needUpdate, showColor, color} = this.state

		return (
			<div className="item" style={{background: color}}>
				<input ref={this.refInput} className="text" value={text}
					   onInput={this.handleInput}
					   onFocus={this.onFocus}/>
				{renderIf(!needUpdate)(
					<>
						<div className="btn ml-auto" onClick={this.onEdit}>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
								 xmlns="http://www.w3.org/2000/svg">
								<path
									d="M13.1168 0.877856C14.1047 -0.110632 15.7078 -0.110632 16.6957 0.877856L17.1211 1.30395C18.109 2.29254 18.109 3.89532 17.1211 4.88321L10.1883 11.8195C9.88242 12.1219 9.50625 12.3434 9.09141 12.4629L5.57578 13.4684C5.28047 13.5527 4.96406 13.4684 4.74609 13.2223C4.53164 13.0359 4.44727 12.7195 4.53164 12.4242L5.53711 8.9086C5.65664 8.49375 5.87813 8.11758 6.18047 7.81172L13.1168 0.877856ZM15.4723 2.07106C15.1734 1.74165 14.6391 1.74165 14.3086 2.07106L13.2855 3.09375L14.9062 4.71446L15.9293 3.65977C16.2598 3.36094 16.2598 2.82657 15.9293 2.49715L15.4723 2.07106ZM7.16133 9.37266L6.5707 11.4293L8.62734 10.8387C8.76797 10.8 8.89102 10.7262 8.99297 10.6242L13.7145 5.90625L12.0938 4.28555L7.37578 9.00704C7.27383 9.10899 7.2 9.23204 7.16133 9.37266ZM7.03125 2.25C7.49883 2.25 7.875 2.62793 7.875 3.09375C7.875 3.56133 7.49883 3.9375 7.03125 3.9375H3.09375C2.31715 3.9375 1.6875 4.5668 1.6875 5.34375V14.9063C1.6875 15.6832 2.31715 16.3125 3.09375 16.3125H12.6562C13.4332 16.3125 14.0625 15.6832 14.0625 14.9063V10.9688C14.0625 10.5012 14.4387 10.125 14.9062 10.125C15.3738 10.125 15.75 10.5012 15.75 10.9688V14.9063C15.75 16.6148 14.3648 18 12.6562 18H3.09375C1.38516 18 0 16.6148 0 14.9063V5.34375C0 3.63516 1.38516 2.25 3.09375 2.25H7.03125Z"
									fill="white"/>
							</svg>
						</div>
						<div className="btn" onClick={this.onRemove}>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
								 xmlns="http://www.w3.org/2000/svg">
								<rect width="21.1945" height="3.97398" rx="1.98699"
									  transform="matrix(-0.713079 0.701084 -0.713079 -0.701084 17.9471 2.78609)"
									  fill="white"/>
								<rect width="21.1945" height="3.97398" rx="1.98699"
									  transform="matrix(-0.713079 -0.701084 0.713079 -0.701084 15.1663 18)"
									  fill="white"/>
							</svg>
						</div>
					</>
				)}
				{renderIf(needUpdate)(
					<>
						<div className="btn ml-auto">
							<div className="btn" onClick={this.toggleColor}>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
									 xmlns="http://www.w3.org/2000/svg">
									<path
										d="M16.0631 11.5195C15.974 11.5825 14.1261 13.5691 14.1261 14.9634C14.1261 16.4335 15.0452 17.3722 16.0631 17.4234C16.9405 17.4667 18 16.5467 18 14.9634C18 13.4875 16.1522 11.5825 16.0631 11.5195ZM5.9774 17.4234C6.34348 17.7953 6.82966 18 7.34682 18C7.86398 18 8.35016 17.7953 8.71624 17.4234L15.4955 10.5355L14.8108 9.83983L7.34682 2.25627L5.12612 0L3.7567 1.39135L5.9774 3.64762L0.567524 9.14415C0.201442 9.5161 0 10.0101 0 10.5355C0 11.061 0.201442 11.5549 0.567524 11.9269L5.9774 17.4234ZM7.34682 5.03898L12.7567 10.5355H1.93694L7.34682 5.03898Z"
										fill="white"/>
								</svg>
							</div>
							{renderIf(showColor)(
								<div className="color-container">
									{COLORS.map(this.renderColor)}
								</div>
							)}
						</div>
						<div className="btnUpdate_container">
							<div className="btnUpdate" onClick={this.onUpdate}>
								Update
							</div>
						</div>
						<div className="btn" onClick={this.onNoEdit}>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
								 xmlns="http://www.w3.org/2000/svg">
								<rect width="21.1945" height="3.97398" rx="1.98699"
									  transform="matrix(-0.713079 0.701084 -0.713079 -0.701084 17.9471 2.78609)"
									  fill="white"/>
								<rect width="21.1945" height="3.97398" rx="1.98699"
									  transform="matrix(-0.713079 -0.701084 0.713079 -0.701084 15.1663 18)"
									  fill="white"/>
							</svg>
						</div>
					</>
				)}
				{renderIf(blur)(
					<div className="blur"/>
				)}
			</div>
		);
	}
}

export default Item;
