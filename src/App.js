import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";
// import {IconContext} from "react-icons"
import {FaCheck, FaEdit, FaPlus, FaTrash} from "react-icons/fa"
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };


  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
    .delete(`/api/todos/${item.id}/`)
    .then((res) => this.refreshList());
  };

  handleComplete = (item) => {
    item.completed = true;
    axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };


  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-pills">
        <span
          // className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          className={this.state.viewCompleted ? "btn btn-sm btn-outline-dark active rounded-lg" : "btn btn-sm btn-outline-dark mr-2 rounded-lg"}
          onClick={() => this.displayCompleted(true)}
        >
          Done
        </span>
        <span
          // className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          className={this.state.viewCompleted ? "btn btn-sm btn-outline-dark ml-2 rounded-lg" : "btn btn-sm btn-outline-dark active rounded-lg"}
          onClick={() => this.displayCompleted(false)}
        >
          To Do
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 col-md-8 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button hidden={this.state.viewCompleted}
            className="btn btn-success mr-2"
            onClick={() => this.handleComplete(item)}
          >
            <div>
              <FaCheck />
            </div>
          </button>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            <div>
              <FaEdit />
            </div>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            <div>
              <FaTrash />
            </div>
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  <FaPlus />
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;