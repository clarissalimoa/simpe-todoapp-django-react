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
  Container,
} from "reactstrap";

import axios from "axios";
import {FaPlus, FaTrash} from "react-icons/fa"

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      todoList: [],
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
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };


  handleDelete = (item) => {
    axios
    .delete(`/api/savedtodos/${item.id}/`)
    .then((res) => this.refreshList());
  };

  renderItems = () => {
    const newItems = this.state.todoList;
    const { onSave } = this.props;


    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className='todo-title mr-2 col-md-8'
          title={item.description}
        >
          {item.title}
        </span>
        <span>
        <button
            className="btn btn-success mr-2"
            onClick={() => onSave(item)}
          >
            <div>
              <FaPlus />
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
    const { selectedModal, toggle, onSave } = this.props;

    return (
      <Container>
        <Modal isOpen={selectedModal === 'modal1'? true:false} toggle={toggle}>
          <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="todo-title">Title</Label>
                <Input
                  type="text"
                  id="todo-title"
                  name="title"
                  value={this.state.activeItem.title}
                  onChange={this.handleChange}
                  placeholder="Enter Todo Title"
                />
              </FormGroup>
              <FormGroup>
                <Label for="todo-description">Description</Label>
                <Input
                  type="text"
                  id="todo-description"
                  name="description"
                  value={this.state.activeItem.description}
                  onChange={this.handleChange}
                  placeholder="Enter Todo description"
                />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="completed"
                    checked={this.state.activeItem.completed}
                    onChange={this.handleChange}
                  />
                  Completed
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="saved"
                    checked={this.state.activeItem.saved}
                    onChange={this.handleChange}
                  />
                  Save task to favorite todos list
                </Label>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={() => onSave(this.state.activeItem)}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={selectedModal === 'modal2'? true:false} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </Modal>
    </Container>
    );
  }
}