import { useEffect, useState } from "react";


const Home = () => {
	const [list, setList] = useState([]);
	const [input, setInput] = useState("");
	const USER_URL = "https://playground.4geeks.com/todo/users/erickjdsl3.0";
	const TODO_URL = "https://playground.4geeks.com/todo/todos/erickjdsl3.0";


	async function getList() {
		try {
			let response = await fetch(USER_URL);
			if (response.status === 404) {

				await createUser();
			} else {
				let data = await response.json();

				setList(data.todos || []);
			}
		} catch (error) {
			console.log(error);
		}
	}


	async function createUser() {
		await fetch(USER_URL, { method: "POST" });
		getList();
	}


	async function addTask() {
		if (input.trim() === "") return;

		const newTask = { label: input, is_done: false };

		try {
			let response = await fetch(TODO_URL, {
				method: "POST",
				body: JSON.stringify(newTask),
				headers: { "Content-Type": "application/json" }
			});

			if (response.ok) {
				setInput("");
				getList();
			}
		} catch (error) {
			console.log(error);
		}
	}


	async function deleteTask(id) {
		try {

			let response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE"
			});

			if (response.ok) {
				getList();
			}
		} catch (error) {
			console.log(error);
		}
	}


	async function clearAll() {
		try {
			let response = await fetch(USER_URL, { method: "DELETE" });
			if (response.ok) {
				setList([]);
				await createUser();
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getList();
	}, []);

	return (
		<div className="container text-center mt-5">
			<h1 className="todo-title">To Do List</h1>

			<div className="input-group mb-3 w-50 mx-auto">
				<input
					type="text"
					className="form-control"
					value={input}
					onChange={(e) => setInput(e.target.value)}

				/>
				<button className="btn btn-success" onClick={addTask}>+</button>
			</div>

			<div className="card-container">
				{list.length === 0 ? (
					<p className="text-muted">There is no tasks.</p>
				) : (
					list.map((task) => (
						<div className="card w-50 mx-auto mb-2 item-card" key={task.id}>
							<div className="card-body d-flex justify-content-between align-items-center">
								<span className="card-text">{task.label}</span>
								<button
									className="btn btn-outline-danger btn-sm delete-icon"
									onClick={() => deleteTask(task.id)}
								>
									X
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{list.length > 0 && (
				<button className="btn btn-danger mt-4" onClick={clearAll}>
					Clear
				</button>
			)}
		</div>
	);
};

export default Home;