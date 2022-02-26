import React from "react";
import "./ColorItem.css"
import {renderIf} from "../../../../Utils/Supports";
import PubSub from "pubsub-js";
import {TOPIC_COLOR_CHANGE} from "../../../../config/Constant";
import ColorItemEvent from "./ColorItemEvent";

class ColorItem extends React.Component<any> {
	tokenColorChange: any;

	constructor(props: any) {
		super(props);
	}

	state = {
		selected: false
	}

	componentDidMount() {
		this.tokenColorChange = PubSub.subscribe(TOPIC_COLOR_CHANGE, this.onColorChange);
	}

	componentWillUnmount() {
		PubSub.unsubscribe(this.tokenColorChange);
	}

	onColorChange = (topic: string, event: ColorItemEvent) => {
		if (event.color !== this.props.color) {
			this.setState({selected: false})
		}
	}

	onSelect = () => {
		this.setState({selected: !this.state.selected});
		let event: ColorItemEvent = {
			color: this.props.color
		}

		PubSub.publish(TOPIC_COLOR_CHANGE, event);
	}

	render() {
		const {color} = this.props;
		const {selected} = this.state;

		return (
			<div className="color-item" onClick={this.onSelect}>
				<div className="color" style={{background: color}}>
					{renderIf(selected)(
						<div className="selected">
							<svg width="10" height="8" viewBox="0 0 10 8" fill="none"
								 xmlns="http://www.w3.org/2000/svg">
								<path
									d="M5.22825 7.44189C4.96568 7.77394 4.55678 7.97802 4.11468 7.9983C3.67257 8.0188 3.24438 7.85277 2.94814 7.54623L0.293482 4.80138C-0.128427 4.36541 -0.0909485 3.69337 0.376967 3.30026C0.84533 2.90715 1.56617 2.94228 1.98808 3.37846L3.86624 5.32058C3.89407 5.34943 3.93447 5.36491 3.97598 5.36303C4.01773 5.36114 4.05588 5.3417 4.08079 5.31075L7.94126 0.432253C8.31492 -0.0403119 9.02902 -0.140889 9.53643 0.207471C10.0434 0.55583 10.1511 1.22118 9.77723 1.69354L5.22825 7.44189Z"
									fill="white"/>
							</svg>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default ColorItem;
