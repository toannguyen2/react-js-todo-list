import React from 'react';
import Background from "./View/Background/Background";
import Todo from "./View/Todo/Todo";

class App extends React.Component {
	render() {
		return (
			<>
				<Background/>
				<Todo/>
			</>
		);
	}
}

export default App;
