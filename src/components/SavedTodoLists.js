import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";
import {FaPlus, FaEdit, FaTrash} from "react-icons/fa"

export default class SavedTodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        todoList: [],
        modal: false,
        activeItem: this.props.activeItem,
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/savedtodos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleChange = (e) => {
    
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
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </Modal>
    );
  }
}