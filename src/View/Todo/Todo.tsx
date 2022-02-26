import React from 'react';
import TodoForm from "./Form/TodoForm";
import './Todo.css';
import List from "./List/List";

class Todo extends React.Component {
	render() {
		return (
			<div id="todo_container">
				<div className="todo_title">
					<h1 className="title">
						Todo list
					</h1>
				</div>
				<TodoForm/>
				<List/>
			</div>
		);
	}
}

export default Todo;
