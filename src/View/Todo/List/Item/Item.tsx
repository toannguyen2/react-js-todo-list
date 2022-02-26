import React from "react";
import "./Item.css"

class Item extends React.Component<any> {

	constructor(props: any) {
		super(props);
	}

	render() {
		const {todo} = this.props
		return (
			<div className="item" style={{background: todo.color}}>
				<div className="text">
					{todo.text}
				</div>
			</div>
		);
	}
}

export default Item;
